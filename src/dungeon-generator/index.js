const db = require('../db');
const Dungeon = require('./generators/dungeon');
const _ = require('lodash');

module.exports.generate = (user, quests) => {
    user.tikalId = `${user.id}_${user.provider}`;

    return new Promise((resolve, reject) => {
        db.getDungeon(user.tikalId)
            .then(doc => {
                if (doc) {
                    resolve({firstRoomId: doc.dungeon[0].id});

                } else {
                    const dungeon = new Dungeon().generate(quests).persistAndReset();
                    const newDoc = {
                        key: user.tikalId,
                        hash: dungeon.hash,
                        numOfValidationTries: 0,
                        lastVisitedRoomId: [dungeon.dungeon[0].id],
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

module.exports.validate = (key, hash) => {
    return new Promise((resolve, reject) => {
        db.getDungeon(key)
            .then(doc => {
                if (!doc) {
                    reject(new Error(`Dungeon not found for key ${key}`));
                }

                if (doc.numOfValidationTries >= 10) {
                    reject(new Error('You have reached the limit of validation tries!'));

                } else {
                    db.updateNumberOfTries(key)
                        .then(number => resolve({validated: hash === doc.hash}))
                        .catch(err => reject(err));
                }

            })
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

                const lastVisitedRoom = Number(_.last(doc.lastVisitedRoomId));

                if (lastVisitedRoom !== Number(roomId)) {
                    reject(new Error(`You are currently in room ${lastVisitedRoom}, you cannot make this operation on room ${roomId}, you are not there!`));
                }

                resolve({
                    room: doc.dungeon[roomId],
                    items: doc.dungeon.items
                });
            })
            .catch(err => reject(err));
    });
};

module.exports.getRoomDescription = (key, roomId) => {
    // auto pick up -> update db that player collected the item
    // if it is the last item in the quest and all prereqs are valid, also return the tikalTag
    return new Promise((resolve, reject) => {
        this.getRoom(key, roomId)
            .then(doc => {
                const room = doc.room;
                const items = doc.items;

                let desc = {
                    hashLetter: room.tikalTag
                };

                if (room.item) {
                    if (!room.item.prereqId) {
                        // just do the item action (update db) and give the hash.
                        desc.quest = {
                            questId: room.item.questId,
                            itemId: room.item.itemId,
                            description: `${room.item.desc} ${room.item.action}`
                        };

                        if (room.item.encoding) {
                            delete desc.hashLetter;
                        }

                        if (!_.find(items, {'itemId': room.item.itemId})) {
                            db.updateItem(key, room.item).then((items) => {
                                resolve({description: desc});
                            });
                        } else {
                            resolve({description: desc});
                        }
                    }

                    if (room.item.prereqId) {
                        // if prereq, check if prereq already done.
                        // yes? do action. no? do actionPrereqNotMet
                        if (_.find(items, {'itemId': room.item.prereqId})) {
                            // prereq exists, pick it up and give hash.
                            desc.quest = {
                                questId: room.item.questId,
                                itemId: room.item.itemId,
                                description: `${room.item.desc} ${room.item.action}`
                            };

                            if (!_.find(items, {'itemId': room.item.itemId})) {
                                db.updateItem(key, room.item).then((items) => {
                                    resolve({description: desc});
                                });
                            } else {
                                resolve({description: desc});
                            }

                        } else {
                            // prereq not met, do actionPrereqNotMet and remove hash
                            delete desc.hashLetter;
                            desc.quest = {
                                questId: room.item.questId,
                                itemId: room.item.itemId,
                                description: `${room.item.desc} ${room.item.actionPrereqNotMet}`
                            };

                            resolve({description: desc});
                        }
                    }
                } else {
                    resolve({description: desc});
                }

            })
            .catch(err => reject(err.message));
    });
};

module.exports.getRoomExits = (key, roomId) => {
    return new Promise((resolve, reject) => {
        this.getRoom(key, roomId)
            .then(doc => {
                const exits = doc.room.exits.map((exit) => {
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
            .then(doc => {
                const nextRoomIds = doc.room.exits
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