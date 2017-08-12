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

module.exports.getDungeon = (key, projection) => {
	return new Promise((resolve, reject) => {
		state.collection.find({key: key}, projection).limit(1).next((err, doc) => {
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

			resolve()
		});
	});
};

module.exports.getRoomById = (key, roomId) => {
	return new Promise((resolve, reject) => {
		state.collection.find(
			{key: key},
			{rooms: {$elemMatch: {id: roomId}}, visitedRoomIds: 1}).next((err, doc) => {
			if (err) {
				reject(err);
			}

			if (doc.rooms.length !== 1) {
				reject(new Error(`Couldn't find room ${roomId}.`))
			}

			resolve({
				room: doc.rooms[0],
				visitedRoomIds: doc.visitedRoomIds
			});
		});
	});
};

module.exports.updateLastVisitedRoom = (key, roomId) => {
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

				state.collection.updateOne(
					{key: key},
					{$set: {visitedRoomIds: rooms, currentRoom: doc.room}},
					{},
					(err, r) => {
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
		this.getRoomById(key, 0).then((doc) => {
			state.collection.findOneAndUpdate(
				{key: key},
				{
					$inc: {"metrics.numOfResets": 1},
					$set: {"items": [], visitedRoomIds: [0], currentRoom: doc.room}
				},
				{returnNewDocument: true},
				(err, r) => {
					if (err) {
						reject(err);
					}

					if (r.ok !== 1) {
						reject(new Error(`Key + RoomId combination not unique!`));
					}

					resolve({currentRoomId: 0});
				});

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

module.exports.validate = (key, hashCandidate) => {
	return new Promise((resolve, reject) => {
		this.getDungeon(key, {metrics: 1})
			.then(doc => {
				if (!doc) {
					reject(new Error(`Dungeon not found for key ${key}`));
				}

				let {metrics} = doc;
				const validated = hashCandidate === doc.hash;

				metrics.numOfValidationTries += 1;

				if (validated) {
					metrics.timeToSolve = Date.now() - doc.challengeStarted;
					metrics.score = calculateScore(metrics);
				}

				state.collection.findOneAndUpdate(
					{key: key},
					{$set: {metrics: metrics}},
					{returnOriginal: false},
					(err, r) => {
						if (err) {
							reject(err);
						}

						if (r.ok !== 1) {
							reject(new Error(`Number of tries not incremented`));
						}

						resolve({validated: validated});
					});
			});
	});
};

module.exports.updateApiCount = (key) => {
	return new Promise((resolve, reject) => {
		state.collection.findOneAndUpdate(
			{key: key},
			{$inc: {"metrics.numOfApiCalls": 1}},
			{returnOriginal: false},
			(err, r) => {
				if (err) {
					reject(err);
				}

				if (r.ok !== 1) {
					reject(new Error(`Number of API calls not incremented`));
				}

				resolve(r.value.metrics.numOfApiCalls);
			});
	});
};

module.exports.updateRoom = (key, room) => {
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
					resolve()
				});

			})
			.catch(err => reject(err));
	});
};

module.exports.updateItem = (key, item) => {
	return new Promise((resolve, reject) => {
		state.collection.findOneAndUpdate(
			{key: key},
			{$addToSet: {"items": item}},
			{returnOriginal: false},
			(err, r) => {
				if (err) {
					reject(err);
				}

				if (r.ok !== 1) {
					reject(new Error(`Could not update item`));
				}

				resolve(r.value.items);
			});
	});
};