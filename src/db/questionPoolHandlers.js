const _ = require('lodash');
const bdUrl = require('../../conf/mongo').url;
const DB = require('./index');
const mongoClient = require('mongodb').MongoClient;

function getAllQuestions() {
	const db = DB.state.db;
	const collection = db.collection('questionPool');

	return collection.find().toArray();
}

function getNRandomQuestions(n) {
	const db = DB.state.db;
	const collection = db.collection('questionPool');

	// Random pick could, potentially return duplicate values while in writing phase
	// due to the fact that this collection is 99.99% for reads, I'm not implementing
	// the workaround.
	return collection.aggregate(
		[ { $sample: { size: n } } ]
	).toArray();
}

module.exports.getAllQuestions = getAllQuestions;
module.exports.getNRandomQuestions = getNRandomQuestions;