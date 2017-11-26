const _ = require('lodash');

const DB = require('./index');
const mongo = require('mongodb');
const mongoClient = require('mongodb').MongoClient;

function getAllQuestions() {
	const db = DB.state.db;
	const collection = db.collection('questionPool');

	return collection.find().toArray();
}

function isCandidator(uid) {
	// find
}