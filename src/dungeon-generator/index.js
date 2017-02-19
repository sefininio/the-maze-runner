const db = require('../db');
const Dungeon = require('./generators/dungeon');

module.exports.generate = (user) => {
    user.tikalId = `${user.id}_${user.provider}`;

    return new Promise((resolve, reject) => {
        db.getDungeon(user.tikalId)
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

                    return db.saveDungeon(newDoc);
                }
            })
            .then(firstRoomId => resolve(firstRoomId))
            .catch(err => reject(err));
    });
};

module.exports.getRoom = (key, roomId) => {
    return new Promise((resolve, reject) => {
        db.getDungeon(key)
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

module.exports.getRoomDescription = (key, roomId) => {
    return new Promise((resolve, reject) => {
        this.getRoom(key, roomId)
            .then(room => {
                resolve({
                    description: {
                        hashLetter: room.tikalTag
                    }
                });
            })
            .catch(err => reject(err.message));
    });
};

module.exports.getRoomExits = (key, roomId) => {
    return new Promise((resolve, reject) => {
        this.getRoom(key, roomId)
            .then(room => {
                const exits = room.exits.map((exit) => {
                    return exit.direction;
                });

                resolve({exits: exits});
            })
            .catch(err => reject(err.message));
    });
};

module.exports.exitRoom = (key, roomId, direction) => {
    return new Promise((resolve, reject) => {
        this.getRoom(key, roomId)
            .then(room => {
                const nextRoomIds = room.exits
                    .filter(exit => exit.direction === parseInt(direction))
                    .map(exit => exit.targetRoomId);

                if (nextRoomIds.length !== 1) {
                    reject(`Room ${roomId} does not have an exit at direction ${direction}`);

                } else {
                    return db.updateLastVisitedRoom(key, nextRoomIds[0]);

                }
            })
            .then(newRoomId => resolve({newRoomId: newRoomId}))
            .catch(err => reject(err.message));
    });
};