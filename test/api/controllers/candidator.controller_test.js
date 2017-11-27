const chai = require('chai');
const should = chai.should();
const app = require('../../../app');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const QuestionPool = mongoose.model('questionPool');
const Candidator = mongoose.model('candidator');

chai.use(chaiHttp);

describe("Test of the /api/v1/candidator endpoint", () => {
	it("Health check should be OK", (done) => {
		chai.request(app)
			.get('/api/v1/candidator/hc')
			.then((res) => {
				res.body.should.have.property('status');
				res.body.status.should.equal('OK');
				done();
			});
	});

	it("GET to /api/v1/candidator/questions should retrieve 5 random questions from Candidator collection", (done) => {
		const benzi = new Candidator({
			finalGrade: 10
 		});
		benzi.save()
			.then(() => {
				chai.request(app)
					.get('/api/v1/candidator/questions')
					.then((res) => {
						// console.log('res.body', res.body);
						done();
					})
					.catch(e => {
						console.log('e.message', e.message);
						done();
					});
			});
	});
});