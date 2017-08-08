const _ = require('lodash');
const bdUrl = require('../../conf/mongo').url;
const mongoClient = require('mongodb').MongoClient;

const state = {
	db: null,
	collection: null
};

module.exports.connect = (done) => {
	if (state.db && state.collection) {
		return done();
	}

	mongoClient.connect(bdUrl, (err, db) => {
		if (err) {
			return done(err);
		}

		state.db = db;
		state.collection = db.collection('dungeon');
		done();
	})
};

module.exports.close = (done) => {
	if (state.db) {
		state.db.close((err, result) => {
			state.db = null;
			state.mode = null;
			done(err);
		});
	}
};

module.exports.getDungeon = (key) => {
	return new Promise((resolve, reject) => {
		state.collection.find({key: key}).limit(1).next((err, doc) => {
			if (err) {
				reject(err);
			}

			resolve(doc);
		});
	});
};

module.exports.saveDungeon = (doc) => {
	return new Promise((resolve, reject) => {
		state.collection.insertOne(doc, (err, r) => {
			if (err) {
				reject(err);
			}

			resolve({
				tikalId: doc.key,
				clue: doc.clue
			});
		});
	});
};

module.exports.updateDungeon = (dungeon) => {
	return new Promise((resolve, reject) => {
		state.collection.updateOne({key: dungeon.key}, dungeon, {}, (err, r) => {
			if (err) {
				reject(err);
			}

			if (r.modifiedCount !== 1) {
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
		this.getDungeon(key)
			.then(doc => {
				if (!doc) {
					reject(new Error(`Dungeon not found for key ${key}`));
				}

				let rooms = _.uniq(doc.lastVisitedRoomId);
				if (_.last(rooms) !== roomId) {
					rooms.push(roomId);
				}

				state.collection.updateOne({key: key}, {$set: {lastVisitedRoomId: rooms}}, {}, (err, r) => {
					if (err) {
						reject(err);
					}

					if (r.modifiedCount !== 1) {
						reject(new Error(`Key + RoomId combination not unique!`));
					}

					resolve(roomId);
				});

			})
			.catch(err => reject(err));
	});
};

module.exports.reset = (key) => {
	return new Promise((resolve, reject) => {
		this.getDungeon(key)
			.then(doc => {
				if (!doc) {
					reject(new Error(`Dungeon not found for key ${key}`));
				}

				state.collection.updateOne({key: key}, {
					$inc: {numOfResets: 1},
					$set: {"dungeon.items": [], lastVisitedRoomId: [0]}
				}, {}, (err, r) => {
					if (err) {
						reject(err);
					}

					if (r.modifiedCount !== 1) {
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
		state.collection.findOneAndUpdate({key: key}, {$inc: {numOfValidationTries: 1}}, {returnOriginal: false}, (err, r) => {
			if (err) {
				reject(err);
			}

			if (r.ok !== 1) {
				reject(new Error(`Number of tries not incremented`));
			}

			resolve(r.value.numOfValidationTries);
		});
	});
};

module.exports.updateRoom = (key, room) => {
	return new Promise((resolve, reject) => {
		this.getDungeon(key)
			.then(doc => {
				if (!doc) {
					reject(new Error(`Dungeon not found for key ${key}`));
				}

				doc.dungeon[room.id] = room;

				this.updateDungeon(doc).then(() => {
					resolve()
				});

			})
			.catch(err => reject(err));
	});
};

module.exports.updateItem = (key, item) => {
	return new Promise((resolve, reject) => {
		state.collection.findOneAndUpdate({key: key}, {$addToSet: {"dungeon.items": item}}, {returnOriginal: false}, (err, r) => {
			if (err) {
				reject(err);
			}

			if (r.ok !== 1) {
				reject(new Error(`Could not update item`));
			}

			resolve(r.value.dungeon.items);
		});
	});
};