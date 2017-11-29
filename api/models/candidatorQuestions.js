const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CandidatorQuestionsSchema = new Schema({
	qid: String,
	tries: [String],
	score: Number
});

module.exports = CandidatorQuestionsSchema;