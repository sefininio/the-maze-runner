const QuestionPool = require('../models/questionPool');
const { uniqWith, isEqual } = require('lodash');

module.exports = {
	getRandomQuestions(numOfQuestions) {
		//todo - make sure that the length of the received array is equal to numOfQuestions and has no duplicates


		return QuestionPool.aggregate(
			[{ $sample: { size: numOfQuestions } }]
		)
			.then((questions) => {
				return areQuestionsValid(questions, numOfQuestions) ? questions : Promise.reject({ message: "Not enough questions to pick from" });
			});
	}

};

function areQuestionsValid(questions, expectedLength) {
	const lengthCondition = questions.length === expectedLength;
	const duplicatesCondition = uniqWith(questions, isEqual);

	return lengthCondition && duplicatesCondition.length === expectedLength;
}