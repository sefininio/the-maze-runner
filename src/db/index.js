const _ = require('lodash');
const bdUrl = require('../../conf/mongo').url;
const mongoClient = require('mongodb').MongoClient;

const state = {
    db: null,
    dungeon: null,
    questionsPool: null,
};

const connect = done => {
    const { db, dungeon, questionsPool } = state;
    if (db && dungeon && questionsPool) {
        return done();
    }

    mongoClient.connect(bdUrl, (err, _db) => {
        if (err) {
            return done(err);
        }

        state.db = _db;
        state.dungeon = _db.collection('dungeon');
        state.candidatoreResponses = _db.collection('candidatoreResponses');
        state.questionsPool = _db.collection('questionsPool');
        _db.collection('dungeon').createIndexes({ key: 'hashed' }, () => {
            _db.collection('candidatoreResponses').createIndex({ session: 1, tikalId: 1 }, () => {
                done();
            });
        });
    });
};

const close = done => {
    if (state.db) {
        state.db.close((err, result) => {
            state.db = null;
            state.mode = null;
            done(err);
        });
    }
};

const getDungeon = (key, projection) => {
    return new Promise((resolve, reject) => {
        state.dungeon
            .find({ key: key }, projection)
            .limit(1)
            .next((err, doc) => {
                if (err) {
                    reject(err);
                }

                resolve(doc);
            });
    });
};

const saveDungeon = doc => {
    return new Promise((resolve, reject) => {
        state.dungeon.insertOne(doc, (err, r) => {
            if (err) {
                reject(err);
            }

            resolve({
                tikalId: doc.key,
                clue: doc.clue,
            });
        });
    });
};

const updateDungeon = dungeon => {
    return new Promise((resolve, reject) => {
        state.dungeon.updateOne({ key: dungeon.key }, dungeon, {}, (err, r) => {
            if (err) {
                reject(err);
            }

            if (r.modifiedCount !== 1) {
                reject(new Error(`Failed to save dungeon for ${dungeon.key}`));
            }

            resolve();
        });
    });
};

const getRoomById = (key, roomId) => {
    return new Promise((resolve, reject) => {
        state.dungeon
            .find({ key: key }, { rooms: { $elemMatch: { id: roomId } }, visitedRoomIds: 1 })
            .next((err, doc) => {
                if (err) {
                    reject(err);
                }

                if (doc.rooms.length !== 1) {
                    reject(new Error(`Couldn't find room ${roomId}.`));
                }

                resolve({
                    room: doc.rooms[0],
                    visitedRoomIds: doc.visitedRoomIds,
                });
            });
    });
};

const updateLastVisitedRoom = (key, roomId) => {
    return new Promise((resolve, reject) => {
        this.getRoomById(key, roomId)
            .then(doc => {
                if (!doc) {
                    reject(new Error(`Dungeon not found for key ${key}`));
                }

                let rooms = _.uniq(doc.visitedRoomIds);
                if (_.last(rooms) !== roomId) {
                    rooms.push(roomId);
                }

                state.dungeon.updateOne(
                    { key: key },
                    { $set: { visitedRoomIds: rooms, currentRoom: doc.room } },
                    {},
                    (err, r) => {
                        if (err) {
                            reject(err);
                        }

                        if (r.modifiedCount !== 1) {
                            reject(new Error(`Key + RoomId combination not unique!`));
                        }

                        resolve(roomId);
                    }
                );
            })
            .catch(err => reject(err));
    });
};

const reset = key => {
    return new Promise((resolve, reject) => {
        this.getRoomById(key, 0).then(doc => {
            state.dungeon.findOneAndUpdate(
                { key: key },
                {
                    $inc: { 'metrics.numOfResets': 1 },
                    $set: { items: [], visitedRoomIds: [0], currentRoom: doc.room },
                },
                { returnNewDocument: true },
                (err, r) => {
                    if (err) {
                        reject(err);
                    }

                    if (r.ok !== 1) {
                        reject(new Error(`Key + RoomId combination not unique!`));
                    }

                    resolve({ currentRoomId: 0 });
                }
            );
        });
    });
};

function calculateScore(metrics) {
    let score = 250;

    // 1 val = 250, 10 val = 25, 20 val = 12.5...
    score += Math.floor(250 / metrics.numOfValidationTries);

    // 0 resets = 250, 10 resets = 125, 20 resets = 0, ...
    score += Math.floor(-12.5 * metrics.numOfResets + 250);

    // 1K apis = 250, 50K apis = 0, 100K = -255, ...
    score += Math.floor(-0.0051 * metrics.numOfApiCalls + 255);

    // 1h = 500, 24h = 0
    score += Math.floor(-20.8334 * (metrics.timeToSolve / 3600000) + 500);

    return score;
}

const validate = (key, hashCandidate) => {
    return new Promise((resolve, reject) => {
        this.getDungeon(key, { metrics: 1, hash: 1, challengeStarted: 1 }).then(doc => {
            if (!doc) {
                reject(new Error(`Dungeon not found for key ${key}`));
            }

            let { metrics } = doc;
            const validated = hashCandidate === doc.hash;

            metrics.numOfValidationTries += 1;

            if (validated) {
                metrics.timeToSolve = Date.now() - doc.challengeStarted;
                metrics.score = calculateScore(metrics);
            }

            state.dungeon.findOneAndUpdate(
                { key: key },
                { $set: { metrics: metrics } },
                { returnOriginal: false },
                (err, r) => {
                    if (err) {
                        reject(err);
                    }

                    if (r.ok !== 1) {
                        reject(new Error(`Number of tries not incremented`));
                    }

                    resolve({ validated: validated, score: metrics.score });
                }
            );
        });
    });
};

const updateApiCount = key => {
    return new Promise((resolve, reject) => {
        state.dungeon.findOneAndUpdate(
            { key: key },
            { $inc: { 'metrics.numOfApiCalls': 1 } },
            { returnNewDocument: true },
            (err, r) => {
                if (err) {
                    reject(err);
                }

                if (r.ok !== 1) {
                    reject(new Error(`Number of API calls not incremented`));
                }

                resolve(r.value.metrics.numOfApiCalls);
            }
        );
    });
};

const updateRoom = (key, room) => {
    return new Promise((resolve, reject) => {
        // state.collection.updateOne(
        // 	{key: key, rooms: {$elemMatch: {id: room.id}}},
        // 	{$set: {'rooms.$': room}},
        // 	{},
        // 	(err, r) => {
        // 		if (err) {
        // 			reject(err);
        // 		}
        //
        // 		if (r.modifiedCount !== 1) {
        // 			reject(new Error(`Key + RoomId combination not unique!`));
        // 		}
        //
        // 		resolve();
        // 	});

        this.getDungeon(key)
            .then(doc => {
                if (!doc) {
                    reject(new Error(`Dungeon not found for key ${key}`));
                }

                doc.rooms[room.id] = room;

                this.updateDungeon(doc).then(() => {
                    resolve();
                });
            })
            .catch(err => reject(err));
    });
};

const updateItem = (key, item) => {
    return new Promise((resolve, reject) => {
        state.dungeon.findOneAndUpdate(
            { key: key },
            { $addToSet: { items: item } },
            { returnOriginal: false },
            (err, r) => {
                if (err) {
                    reject(err);
                }

                if (r.ok !== 1) {
                    reject(new Error(`Could not update item`));
                }

                resolve(r.value.items);
            }
        );
    });
};

const topScores = limit => {
    return new Promise((resolve, reject) => {
        state.dungeon
            .aggregate([
                { $match: { 'metrics.score': { $gt: 0 } } },
                { $group: { _id: '$user', score: { $max: '$metrics.score' } } },
                { $project: { _id: 0, user: '$_id', score: 1 } },
                { $sort: { score: -1 } },
                { $limit: limit },
            ])
            .toArray((err, doc) => {
                if (err) {
                    reject(err);
                }

                resolve(doc);
            });
    });
};

const getRandomQuestions = (num = 5, tag) => {
    const queryTag = tag.toLowerCase();
    return new Promise((resolve, reject) => {
        state.questionsPool
            .aggregate([{ $match: { tags: { $elemMatch: { $eq: queryTag } } } }, { $sample: { size: num } }])
            .toArray((err, doc) => {
                if (err) {
                    reject(err);
                }
                resolve(doc);
            });
    });
};

const getUserQuestions = tikalId => {
    return new Promise((resolve, reject) => {
        state.dungeon.findOne(
            {
                key: tikalId,
            },
            (err, doc) => {
                if (err) {
                    reject(err);
                }

                resolve(doc.questions);
            }
        );
    });
};

const countAttempts = (tikalId, questionId) =>
    new Promise((resolve, reject) => {
        state.candidatoreResponses.find({ tikalId, 'question._id': questionId }).count((err, num) => {
            if (err) {
                return reject(err);
            }
            return resolve({ attempts: num });
        });
    });

const saveCandidatorResponse = answer =>
    new Promise((resolve, reject) => {
        state.candidatoreResponses.insertOne(answer, err => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });

module.exports = {
    connect,
    close,
    getDungeon,
    saveDungeon,
    updateDungeon,
    getRoomById,
    updateLastVisitedRoom,
    reset,
    validate,
    updateApiCount,
    updateRoom,
    updateItem,
    topScores,
    getRandomQuestions,
    getUserQuestions,
    saveCandidatorResponse,
    countAttempts,
};
