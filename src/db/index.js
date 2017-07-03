const Datastore = require('nedb');
const db = new Datastore({filename: './dungeon.db', autoload: true});

// auto compact db every 30 minutes
db.persistence.setAutocompactionInterval(1800000);

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

module.exports.saveDungeon = (doc) => {
    return new Promise((resolve, reject) => {
        db.insert(doc, (err, newDoc) => {
            if (err) {
                reject(err);
            }

            resolve({
                tikalId: newDoc.key,
                clue: newDoc.clue
            });
        });
    });
};

module.exports.updateDungeon = (dungeon) => {
    return new Promise((resolve, reject) => {
        db.update({key: dungeon.key}, dungeon, {}, (err, numUpdated) => {
            if (err) {
                reject(err);
            }

            if (numUpdated !== 1) {
                reject(new Error(`Failed to save dungeon for ${dungeon.key}`));
            }

            resolve({
                tikalId: dungeon.key,
                firstRoomId: dungeon.dungeon[0].id
            })
        });
    });
};

module.exports.updateLastVisitedRoom = (key, roomId) => {
    return new Promise((resolve, reject) => {
        db.update({key: key}, {$push: {lastVisitedRoomId: roomId}}, {}, (err, numUpdated) => {
            if (err) {
                reject(err);
            }

            if (numUpdated !== 1) {
                reject(new Error(`Key + RoomId combination not unique!`));
            }

            resolve(roomId);
        });
    });
};

module.exports.reset = (key) => {
    return new Promise((resolve, reject) => {
        this.getDungeon(key)
            .then(doc => {
                if (!doc) {
                    reject(new Error(`Dungeon not found for key ${key}`));
                }

                db.update({key: key}, {
                    $inc: {numOfResets: 1},
                    $set: {"dungeon.items": [], lastVisitedRoomId: [0]}
                }, {}, (err, numUpdated) => {
                    if (err) {
                        reject(err);
                    }

                    if (numUpdated !== 1) {
                        reject(new Error(`Key + RoomId combination not unique!`));
                    }

                    resolve({lastVisitedRoomId: 0});
                });

            })
            .catch(err => reject(err));
    });
};

module.exports.updateNumberOfTries = (key) => {
    return new Promise((resolve, reject) => {
        db.update({key: key}, {$inc: {numOfValidationTries: 1}}, {returnUpdatedDocs: true}, (err, numUpdated, doc) => {
            if (err) {
                reject(err);
            }

            if (numUpdated !== 1) {
                reject(new Error(`Number of tries not incremented`));
            }

            resolve(doc.numOfValidationTries);
        });
    });
};

module.exports.updateItem = (key, item) => {
    return new Promise((resolve, reject) => {
        db.update({key: key}, {$addToSet: {"dungeon.items": item}}, {returnUpdatedDocs: true}, (err, numUpdated, doc) => {
            if (err) {
                reject(err);
            }

            if (numUpdated !== 1) {
                reject(new Error(`Could not update item`));
            }

            resolve(doc.dungeon.items);
        });
    });
};