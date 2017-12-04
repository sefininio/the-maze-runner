const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CandidatorQuestionsSchema = require('./candidatorQuestions');

const CandidatorSchema = new Schema({
	questions: [CandidatorQuestionsSchema],
	finalGrade: Number,
	remarks: String,
	status: String,
});

const Candidator = mongoose.model('candidator', CandidatorSchema);

module.exports = Candidator;