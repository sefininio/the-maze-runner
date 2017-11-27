const QuestionPool = require('../models/questionPool');
const Candidator = require('../models/candidator');

module.exports = {
	hc(req, res) {
		res.send({
			status: 'OK'
		});
	},
	getQuestions(req, res) {
		// TODO: When the questions come back, store it under Candidate Document.
		res.send({ questions: true });
/*
		questionPoolHandler.getNRandomQuestions(5)
			.then(questions => {
				res.send(questions);
			})
			.catch(e => {
				console.log('e', e);
				res.send(e.message);
			});
*/
	}
};