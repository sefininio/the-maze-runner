const QuestionPool = require('./../models/questionPool');

module.exports = {
	getRandomQuestions(numOfQuestions) {
		return QuestionPool.aggregate(
			[{$sample: {size: numOfQuestions}}]
		);
	}
};