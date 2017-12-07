const QuestionPool = require('../models/questionPool');
const QuestionPoolController = require('./questionPool.controller');
const Candidator = require('../models/candidator');

module.exports = {
	hc(req, res) {
		console.log('!!!!!!!!!!!');
		res.send({
			status: 'OK'
		});
	},

	assignQuestionsToCandidator(cid, numOfQuestionsToPool) {
		let _questions;

		return QuestionPoolController.getRandomQuestions(numOfQuestionsToPool)
			.then(questions => {
				return Candidator.findByIdAndUpdate(cid, { questions: questions });
			})
			.then(updatedCandidator => ({
				success: true,
				id: updatedCandidator._id,
			}))
			.catch(e => ({
				success: false,
				error: e
			}));

/*
		return QuestionPoolController.getRandomQuestions(numOfQuestionsToPool)
			.then((questions) => {
				console.log('questions.length', questions.length);
				_questions = questions;
				return Candidator.findById(cid)
			})
			.then(candi => {
				console.log('_____candi', candi);
				candi.set('questions', _questions);
				return candi.save();
			})
			.then(p => {

				console.log('p', p)
			})
			.catch(e => {
				console.log('e.message', e.message)
			})
*/
	},
};