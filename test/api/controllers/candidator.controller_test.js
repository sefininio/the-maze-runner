const chai = require('chai');
const should = chai.should();
const app = require('../../../app');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const QuestionPool = mongoose.model('questionPool');
const Candidator = mongoose.model('candidator');
const CandidatorController = require('./../../../api/controllers/candidator.controller');

chai.use(chaiHttp);

describe("Test of the /api/v1/candidator endpoint", () => {
	function addQuestionsToCollection(numOfQuestions) {

		const questions = [];

		for (let i = 0; i < numOfQuestions; i++) {
			questions.push(
				new QuestionPool({
					heroImage: "http://www.gstatic.com/tv/thumb/tvbanners/13806643/p13806643_b_v8_aa.jpg",
					description: "# Hi There\n" +
					"### This is question #" + (i + 1) + "\n" +
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

	function createCandidator() {
		const candi = new Candidator({
			finalGrade: 10
		});

		return candi.save();
	}

	it("Health check should be OK", (done) => {
		chai.request(app)
			.get('/api/v1/candidator/hc')
			.then((res) => {
				res.body.should.have.property('status');
				res.body.status.should.equal('OK');
				done();
			});
	});

	it.only("Candidator.assignQuestionsToCandidator should add questions to the relevant candidator", (done) => {
		let _cid;

		createCandidator()
			.then(() => addQuestionsToCollection(7))
			.then(() => Candidator.findOne({ finalGrade: 10 }))
			.then((candi) => {
				const cid = candi._id;
				_cid = cid;
				return CandidatorController.assignQuestionsToCandidator(_cid, 5)
			})
			.then(assignQuestionsToCandidatorResponse => {
				assignQuestionsToCandidatorResponse.should.have.property('success', true);
			})
			.then(() => Candidator.findById({ _id: _cid }))
			.then(candi => {
				console.log('@@@@@@@candi', candi);
				candi.should.have.property('questions');
				candi.questions.should.have.lengthOf(5);
				done();
			})
			.catch(e => {
				console.log('e.message', e.message);
				// done();
			})
	})
});