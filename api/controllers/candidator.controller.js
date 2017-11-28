const QuestionPool = require('../models/questionPool');
const Candidator = require('../models/candidator');

module.exports = {
	hc(req, res) {
		res.send({
			status: 'OK'
		});
	},

	assignQuestionsToCandidator(cid, numOfQuestionsToPool) {
		let questions;

		QuestionPool.getRandomQuestions(numOfQuestionsToPool)
			.then((questions) => Candidator.findByIdAndUpdate({ _id: cid }, {questions}))

	},
};