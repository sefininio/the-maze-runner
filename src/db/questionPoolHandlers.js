const _ = require('lodash');

const DB = require('./index');
const mongo = require('mongodb');
const mongoClient = require('mongodb').MongoClient;

function getAllQuestions() {
	const db = DB.state.db;
	const collection = db.collection('questionPool');

	return collection.find().toArray();
}

function getNRandomQuestions(n) {
	const db = DB.state.db;
	const collection = db.collection('questionPool');

	// Important: Random pick could, potentially return duplicate values while in writing phase
	// due to the fact that this collection is 99.99% for reads, I'm not implementing
	// the workaround.
	return collection.aggregate(
		[{$sample: {size: n}}]
	).toArray();
}

function getQuestionTests(qid) {
	const db = DB.state.db;
	const collection = db.collection('questionPool');

	return collection.find({
		"_id":
			mongo.ObjectID(qid)
	}).toArray();
}

function convertTestResultsToScore(passed, total) {
	return Math.round((passed / total) * 100);
}

module.exports.getAllQuestions = getAllQuestions;
module.exports.getNRandomQuestions = getNRandomQuestions;
module.exports.getQuestionTests = getQuestionTests;
module.exports.convertTestResultsToScore = convertTestResultsToScore;