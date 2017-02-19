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

module.exports.generate = (user) => {
    user.tikalId = `${user.id}_${user.provider}`;

    return new Promise((resolve, reject) => {
        this.getDungeon(user.tikalId)
            .then(doc => {
                if (doc) {
                    resolve({firstRoomId: doc.dungeon[0].id});

                } else {

                    let dungeon = new Dungeon().generate().persistAndReset();
                    let newDoc = {
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
    // TODO - Sefi: verify 'lastVisitedRoom' on DB equals this roomId
    // (you can't get description for a room you are not currently in!).
    return new Promise((resolve, reject) => {
        this.getDungeon(key)
            .then(doc => {
                if (!doc) {
                    reject(new Error(`Dungeon not found for key ${key}`));
                }

                const description = {
                    hashLetter: doc.dungeon[roomId].tikalTag
                };

                resolve(description);
            })
            .catch(err => reject(err));
    });
};

module.exports.getRoomExits = (key, roomId) => {
    return new Promise((resolve, reject) => {
        this.getDungeon(key)
            .then(doc => {
                if (!doc) {
                    reject(new Error(`Dungeon not found for key ${key}`));
                }

                const roomExits = doc.dungeon[roomId].exits;

                resolve(roomExits);
            })
            .catch(err => reject(err));
    });

};

module.exports.getRoomExitDirections = (key, roomId) => {
    // TODO - Sefi: verify 'lastVisitedRoom' on DB equals this roomId
    // (you can't get available exit directions for a room you are not currently in!).
    return new Promise((resolve, reject) => {
        this.getRoomExits(key, roomId)
            .then(exits => {
                const directions = exits.map((exit) => {
                    return exit.direction;
                });

                resolve(directions);
            })
            .catch(err => reject(err));
    });
};

module.exports.exitRoom = (key, roomId, direction) => {
    // TODO - Sefi: verify 'lastVisitedRoom' on DB equals this roomId
    // (you can't exit a room you are not currently in!).
    // TODO - Sefi: Update the 'lastVisitedRoom' on DB.
    return new Promise((resolve, reject) => {

        this.getRoomExits(key, roomId)
            .then(exits => {
                const nextRoomId = exits
                    .filter(exit => exit.direction === parseInt(direction))
                    .map(exit => exit.targetRoomId)
                    .reduce(exit => exit);

                resolve(nextRoomId);
            })
            .catch(err => reject(err));
    });
};