const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CandidatorSchema = new Schema({
	questions: [{
		qid: String,
		tries: [String],
		score: Number
	}],
	finalGrade: Number,
	remarks: [String],
	status: String,
});

const Candidator = mongoose.model('candidator', CandidatorSchema);

module.exports = Candidator;