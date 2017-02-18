const Datastore = require('nedb');
const db = new Datastore({ filename: './dungeon.db', autoload: true });

module.exports.insert = (dungeonObj) => {
    return new Promise((resolve, reject) => {
        db.insert(dungeonObj, (err, newDoc) => {
            if (err) {
                reject(err);
            }

            resolve(newDoc);
        });
    });

};

module.exports.findOne = (key) => {
    return new Promise((resolve, reject) => {
        db.findOne({key: key}, (err, doc) => {
            if (err) {
                reject(err);
            }

            resolve(doc);
        });
    });
};