const Dungeon = require('./generators/dungeon');
const db = require('../db');

module.exports.generate = (user) => {
    user.tikalId = `${user.id}_${user.provider}`;

    return new Promise((resolve, reject) => {
        db.findOne(user.tikalId)
            .then(doc => {
                if (doc) {
                    resolve({firstRoomId: doc.dungeon[0].id});

                } else {

                    let dungeon = new Dungeon().generate().persistAndReset();
                    let dungeonObj = {
                        key: user.tikalId,
                        hash: dungeon.hash,
                        dungeon: dungeon.dungeon,
                        user: user
                    };

                    return db.insert(dungeonObj);
                }
            })
            .then(pDungeonObj => resolve({firstRoomId: pDungeonObj.dungeon[0].id}))
            .catch(err => reject(err));
    });
};

module.exports.getRoomDescription = (key, roomId) => {
    return new Promise((resolve, reject) => {
        db.findOne(key)
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
        db.findOne(key)
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