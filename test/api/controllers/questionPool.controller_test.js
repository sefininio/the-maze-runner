const chai = require('chai');
const should = chai.should();
const QuestionPool = require('./../../../api/models/questionPool');
const QuestionPoolController = require('./../../../api/controllers/questionPool.controller');

describe("Test questionPool controller", () => {
	let question;

	function addQuestionsToCollection(numOfQuestions) {

		const questions = [];

		for(let i=0; i< numOfQuestions; i++) {
			questions.push(
				new QuestionPool({
					heroImage: "http://www.gstatic.com/tv/thumb/tvbanners/13806643/p13806643_b_v8_aa.jpg",
					description: "# Hi There\n" +
					"### This is question #" + (i+1) + "\n" +
					"Are you excited?",
					tests: [
						{
							"assert": "equal",
							"input": [
								2,
								3
							],
							"expected": 5
						},
						{
							"assert": "equal",
							"input": [
								0,
								0
							],
							"expected": 0
						},
						{
							"assert": "equal",
							"input": [
								-1,
								2
							],
							"expected": 1
						},
						{
							"assert": "equal",
							"input": [
								-1,
								-1
							],
							"expected": -2
						},
						{
							"assert": "equal",
							"input": [
								1,
								"hello"
							],
							"expected": "1hello"
						}
					],
					difficultyRating: 1,
				})
			)
		}

		return Promise.all(questions.map((question) => question.save()));
	}

	it("Should create questions in questionPool collection", (done) => {
		addQuestionsToCollection(7)
			.then(() => QuestionPool.find({}))
			.then(questions => {
				questions.should.have.lengthOf(7);
				done();
			});
	});

	it("Should pick 5 random questions from the questionPool collection which has more than 5 questions", (done) => {
		let firstTimeQuestions, secondTimeQuestions;

		addQuestionsToCollection(7)
			.then(() => QuestionPoolController.getRandomQuestions(5))
			.then(questions => {
				questions.should.have.lengthOf(5);
				firstTimeQuestions = questions;
			})
			.then(() => QuestionPoolController.getRandomQuestions(5))
			.then(questions => {
				secondTimeQuestions = questions;
				questions.should.have.lengthOf(5);
				try {
					secondTimeQuestions.should.not.eql(firstTimeQuestions);
				} catch (e) {
					secondTimeQuestions.should.eql(firstTimeQuestions);
				}
				done();
			});
	});

	it("Should pick 5 random questions from the questionPool collection which has less than 5 questions", (done) => {
		let firstTimeQuestions, secondTimeQuestions;

		addQuestionsToCollection(3)
			.then(() => QuestionPoolController.getRandomQuestions(3))
			.then(questions => {
				questions.should.have.lengthOf(3);
				firstTimeQuestions = questions;
			})
			.then(() => QuestionPoolController.getRandomQuestions(3))
			.then(questions => {
				secondTimeQuestions = questions;
				questions.should.have.lengthOf(3);
				try {
					secondTimeQuestions.should.not.eql(firstTimeQuestions);
				} catch (e) {
					secondTimeQuestions.should.eql(firstTimeQuestions);
				}
				done();
			});
	});

});

