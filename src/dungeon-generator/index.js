const db = require('../db');
const Dungeon = require('./generators/dungeon');
const _ = require('lodash');
const quests = require('./quests').quests;
const insults = require('./insults').insults;
const consts = require('./const');

function getTikalId(user) {
	const tikalId = `${user.provider}-${user.id}`;
	const encoded = Buffer.from(tikalId, 'utf8');
	return encoded.toString('base64');
}

function generateClue() {
	const sample = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
	return [
		_.join(_.sampleSize(sample, 8), ''),
		_.join(_.sampleSize(sample, 8), ''),
		_.join(_.sampleSize(sample, 8), ''),
	];
}

module.exports.getClue = (user) => {
	user.tikalId = getTikalId(user);

	return new Promise((resolve, reject) => {
		db.getDungeon(user.tikalId)
			.then(doc => {
				if (doc) {
					// doc already exists, so it must have clue
					resolve({
						key: user.tikalId,
						clue: doc.clue
					});

				} else {
					// create new doc
					const newDoc = {
						key: user.tikalId,
						clue: generateClue(),
						user: user,
					};
					return db.saveDungeon(newDoc);
				}

			})
			.then(res => resolve(res))
			.catch(err => reject(err));
	});

};

module.exports.generate = (user) => {
	user.tikalId = getTikalId(user);

	return new Promise((resolve, reject) => {
		db.getDungeon(user.tikalId)
			.then(doc => {
				if (!doc) {
					// at this point doc must exist with clue
					reject(new Error('no doc found in DB!'));
				}

				if (doc.dungeon) {
					// if doc already has dungeon, no need to generate - just return it.
					resolve({
						tikalId: doc.key,
						firstRoomId: doc.dungeon[0].id
					});

				} else {
					// create the dungeon and update db
					const dungeon = new Dungeon().generate(_.cloneDeep(quests), _.cloneDeep(insults)).persistAndReset();
					const newDoc = {
						key: user.tikalId,
						clue: doc.clue,
						hash: dungeon.hash,
						numOfValidationTries: 0,
						numOfResets: 0,
						lastVisitedRoomId: [dungeon.dungeon[0].id],
						dungeon: dungeon.dungeon,
						user: doc.user,
					};

					return db.updateDungeon(newDoc);
				}
			})
			.then(generateObj => resolve(generateObj))
			.catch(err => reject(err));
	});
};

module.exports.getCurrentRoom = (key) => {
	return new Promise((resolve, reject) => {
		db.getDungeon(key)
			.then(doc => {
				if (!doc || !doc.lastVisitedRoomId) {
					reject(new Error(`Dungeon not found for key ${key}`));
				}

				resolve({
					currentRoomId: _.last(doc.lastVisitedRoomId)
				});

			})
			.catch(err => reject(err));
	});
};

module.exports.reset = (key) => {
	return new Promise((resolve, reject) => {
		db.reset(key)
			.then(doc => {
				if (!doc) {
					reject(new Error(`Dungeon not found for key ${key}`));
				}

				resolve({
					currentRoomId: doc.lastVisitedRoomId
				});
			})
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

				if (doc.numOfValidationTries >= 20) {
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

module.exports.getInsultResponse = (insult) => {
	return new Promise((resolve, reject) => {
		const comeback = _.find(insults, {'insult': insult});
		if (comeback) {
			resolve(comeback);
		} else {
			reject(new Error(`I don't have a comeback for the insult '${insult}'`));
		}
	});
};

module.exports.beatMonster = (key, comeback) => {
	return new Promise((resolve, reject) => {
		this.getRoom(key).then((doc) => {
			const {room, items} = doc;

			if (!room.item || room.item.questId !== consts.QUESTS.INSULT_QUEST) {
				reject(new Error(`Room ${room.id} is not part of the insults quest.`))
			}

			if (room.item.endOfQuest) {
				const {step, queenInsults} = room.item;

				if (queenInsults.length === step) {
					// quest is already complete.
					this.getRoomDescription(key).then((desc) => {
						desc.description.quest.pickedUpItem = true;
						desc.description.hashLetter = room.tikalTag;
						resolve(desc);
					});

				} else if (queenInsults[step].comeback === comeback) {
					// update room item with new step and action
					room.item.step = step + 1;
					if (room.item.step < queenInsults.length) {
						room.item.action = queenInsults[room.item.step].insult;
					} else {
						room.item.action = `You have insulted the Insults Queen beyond retort! She runs away weeping...`
					}
					db.updateRoom(key, room).then(() => {
						//resolve with new desc
						return this.getRoomDescription(key);
					}).then((desc) => {
						if (room.item.step >= queenInsults.length) {
							//resolve with hash
							desc.description.quest.pickedUpItem = true;
							desc.description.hashLetter = room.tikalTag;
						}

						resolve(desc);
					});
				} else {
					reject(new Error(`'${comeback}' is not the correct comeback for the insult '${queenInsults[step].insult}'`));
				}

			} else {
				const insult = room.item.action;
				const correctComeback = _.find(insults, {'insult': insult}).comeback;

				if (comeback === correctComeback) {
					// update dungeon items
					if (!_.find(items, {'itemId': room.item.itemId})) {
						db.updateItem(key, room.item).then((items) => {
							return this.getRoomDescription(key);
						}).then((desc) => {
							//resolve with hash
							desc.description.quest.pickedUpItem = true;
							desc.description.hashLetter = room.tikalTag;
							resolve(desc);
						});

					} else {
						this.getRoomDescription(key).then((desc) => {
							//resolve with hash
							desc.description.quest.pickedUpItem = true;
							desc.description.hashLetter = room.tikalTag;
							resolve(desc);
						});
					}

				} else {
					reject(new Error(`'${comeback}' is not the correct comeback for the insult '${insult}'`));
				}
			}
		});
	});
};

module.exports.getRoom = (key) => {
	return new Promise((resolve, reject) => {
		db.getDungeon(key)
			.then(doc => {
				if (!doc) {
					reject(new Error(`Dungeon not found for key ${key}`));
				}

				const roomId = Number(_.last(doc.lastVisitedRoomId));

				resolve({
					room: doc.dungeon[roomId],
					items: doc.dungeon.items,
					lastVisitedRooms: doc.lastVisitedRoomId,
				});
			})
			.catch(err => reject(err));
	});
};

function doAction(desc, room) {
	desc.quest = {
		questId: room.item.questId,
		itemId: room.item.itemId,
		pickedUpItem: true,
		description: room.item.desc,
		action: room.item.action
	};
}

function doActionPrereq(desc, room) {
	delete desc.hashLetter;
	desc.quest = {
		questId: room.item.questId,
		itemId: room.item.itemId,
		pickedUpItem: false,
		description: room.item.desc,
		action: room.item.actionPrereqNotMet
	};
}

module.exports.getRoomDescription = (key) => {
	// auto pick up -> update db that player collected the item
	// if it is the last item in the quest and all prereqs are valid, also return the tikalTag
	return new Promise((resolve, reject) => {
		this.getRoom(key)
			.then(doc => {
				const room = doc.room;
				const items = doc.items;
				const lastVisitedRooms = doc.lastVisitedRooms;

				let desc = {
					roomId: doc.room.id,
					hashLetter: room.tikalTag
				};

				if (room.item) {
					// if insults quest - never give hash. It will be provided via beat-monster endpoint
					if (room.item.questId === consts.QUESTS.INSULT_QUEST) {
						// hash is only given with the beat-monster endpoint
						delete desc.hashLetter;
						desc.quest = {
							questId: room.item.questId,
							itemId: room.item.itemId,
							pickedUpItem: false,
							description: room.item.desc,
							action: room.item.action
						};

						if (room.item.prereqObj && !_.find(items, {'itemId': room.item.prereqObj.prereqId})) {
							// prereq not met
							desc.quest.action = room.item.actionPrereqNotMet;
						}

						resolve({description: desc});

					} else {

						if (!room.item.prereqObj) {
							// no prereq, just do the item action (update db) and give the hash.
							doAction(desc, room);

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

						if (room.item.prereqObj) {
							// currently, only supports `minUniqueRoomsVisited`, `prereqId`
							if (room.item.prereqObj.minUniqueRoomsVisited) {
								const uniqueVisitedRooms = _.uniq(lastVisitedRooms).length;
								if (uniqueVisitedRooms >= room.item.prereqObj.minUniqueRoomsVisited) {
									// prereq met, pick it up and give hash.
									doAction(desc, room);

									if (!_.find(items, {'itemId': room.item.itemId})) {
										db.updateItem(key, room.item).then((items) => {
											resolve({description: desc});
										});
									} else {
										resolve({description: desc});
									}
								} else {
									// prereq not met, do actionPrereqNotMet and remove hash
									doActionPrereq(desc, room);

									resolve({description: desc});
								}
							}

							if (room.item.prereqObj.prereqId) {
								// if prereq, check if prereq already done.
								// yes? do action. no? do actionPrereqNotMet
								if (_.find(items, {'itemId': room.item.prereqObj.prereqId})) {
									// prereq met, pick it up and give hash.
									doAction(desc, room);

									if (!_.find(items, {'itemId': room.item.itemId})) {
										db.updateItem(key, room.item).then((items) => {
											resolve({description: desc});
										});
									} else {
										resolve({description: desc});
									}

								} else {
									// prereq not met, do actionPrereqNotMet and remove hash
									doActionPrereq(desc, room);

									resolve({description: desc});
								}
							}

						}
					}

				} else {
					resolve({description: desc});
				}

			})
			.catch(err => reject(err));
	});
};

module.exports.getRoomExits = (key) => {
	return new Promise((resolve, reject) => {
		this.getRoom(key)
			.then(doc => {
				const exits = doc.room.exits.map((exit) => {
					return exit.direction;
				});

				resolve({exits: exits});
			})
			.catch(err => reject(err));
	});
};

module.exports.exitRoom = (key, direction) => {
	return new Promise((resolve, reject) => {
		this.getRoom(key)
			.then(doc => {
				const nextRoomIds = doc.room.exits
					.filter(exit => exit.direction === parseInt(direction))
					.map(exit => exit.targetRoomId);

				if (nextRoomIds.length !== 1) {
					reject(new Error(`Room ${doc.room.id} does not have an exit at direction ${direction}`));

				} else {
					return db.updateLastVisitedRoom(key, nextRoomIds[0]);

				}
			})
			.then(newRoomId => resolve({newRoomId: newRoomId}))
			.catch(err => reject(err));
	});
};