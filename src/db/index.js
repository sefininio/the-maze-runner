const Datastore = require('nedb');
const db = new Datastore({ filename: './dungeon.db', autoload: true });
const Dungeon = require('../dungeon-generator/generators/dungeon');

module.exports.getDungeon = (key) => {
    return new Promise((resolve, reject) => {
        db.findOne({key: key}, (err, doc) => {
            if (err) {
                reject(err);
            }

            resolve(doc);
        });
    });
};

module.exports.getRoom = (key, roomId) => {
    return new Promise((resolve, reject) => {
        this.getDungeon(key)
            .then(doc => {
                if (!doc) {
                    reject(new Error(`Dungeon not found for key ${key}`));
                }

                if (!doc.dungeon[roomId]) {
                    reject(new Error(`Room ${roomId} not found in Dungeon`));
                }

                if (Number(doc.lastVisitedRoomId) !== Number(roomId)) {
                    reject(new Error(`You are currently in room ${doc.lastVisitedRoomId}, you cannot make this operation on room ${roomId}, you are not there!`));
                }

                resolve(doc.dungeon[roomId]);
            })
            .catch(err => reject(err));
    });
};

module.exports.getLastVisitedRoom = (key) => {
    return new Promise((resolve, reject) => {
        this.getDungeon(key)
            .then(doc => {
                 resolve(doc.lastVisitedRoomId);
            })
            .catch(err => reject(err));
    });
};

module.exports.updateLastVisitedRoom = (key, roomId) => {
    return new Promise((resolve, reject) => {
        db.update({key: key}, {$set: { lastVisitedRoomId: roomId }}, {}, (err, numReplaced) => {
            if (err) {
                reject(err);
            }

            if (numReplaced !== 1) {
                reject(new Error(`Key + RoomId combination not unique!`));
            }

            resolve(roomId);
        });
    });
};

module.exports.generate = (user) => {
    user.tikalId = `${user.id}_${user.provider}`;

    return new Promise((resolve, reject) => {
        this.getDungeon(user.tikalId)
            .then(doc => {
                if (doc) {
                    resolve({firstRoomId: doc.dungeon[0].id});

                } else {

                    const dungeon = new Dungeon().generate().persistAndReset();
                    const newDoc = {
                        key: user.tikalId,
                        hash: dungeon.hash,
                        lastVisitedRoomId: dungeon.dungeon[0].id,
                        dungeon: dungeon.dungeon,
                        user: user
                    };

                    db.insert(newDoc, (err, newDoc) => {
                        if (err) {
                            reject(err);
                        }

                        resolve({firstRoomId: newDoc.dungeon[0].id});
                    });
                }
            })
            .catch(err => reject(err));
    });
};

module.exports.getRoomDescription = (key, roomId) => {
    return new Promise((resolve, reject) => {
        this.getRoom(key, roomId)
            .then(room => {
                resolve({
                    hashLetter: room.tikalTag
                });
            })
            .catch(err => reject(err.message));
    });
};

module.exports.getRoomExitDirections = (key, roomId) => {
    return new Promise((resolve, reject) => {
        this.getRoom(key, roomId)
            .then(room => {
                const directions = room.exits.map((exit) => {
                    return exit.direction;
                });

                resolve(directions);
            })
            .catch(err => reject(err.message));
    });
};

module.exports.exitRoom = (key, roomId, direction) => {
    return new Promise((resolve, reject) => {
        this.getRoom(key, roomId)
            .then(room => {
                const nextRoomId = room.exits
                    .filter(exit => exit.direction === parseInt(direction))
                    .map(exit => exit.targetRoomId);

                if (nextRoomId.length !== 1) {
                    reject(`Room ${roomId} does not have an exit at direction ${direction}`);

                } else {
                    return this.updateLastVisitedRoom(key, nextRoomId[0]);

                }
            })
            .then(nextRoomId => resolve(nextRoomId))
            .catch(err => reject(err.message));
    });
};