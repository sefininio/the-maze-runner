const Datastore = require('nedb');
const db = new Datastore({ filename: './dungeon.db', autoload: true });

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

module.exports.saveDungeon = (dungeon) => {
    return new Promise((resolve, reject) => {
        db.insert(dungeon, (err, newDoc) => {
            if (err) {
                reject(err);
            }

            resolve({firstRoomId: newDoc.dungeon[0].id});
        });
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