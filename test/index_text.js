const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');

chai.use(chaiHttp);

describe('questionPool api', () => {
	it("get 5 random questions", (done) => {
		chai.request(server)
			.get('/candidator/questions')
			.then(res => {
				res.should.have.status(200);
				res.body.should.be.an('array');
				res.body.length.should.equal(5);
				done();
			})
			.catch(e => console.log('e', e.message))
	});

	 // it("Should validate candidate's submission", (done) => {
	 // 	chai.request('http://localhost:3000')
		//     .post('/candidator/validate')
		//     .send({
		// 	    code: 'a+b',
		// 	    qid: '5a0d6349f3b6ddc1f3e6e048',
		//     })
		//     .then(res => {
		//     	res.should.have.status(200);
		//     	done();
		//     })
	 // })
});

describe("Submission Validation", () => {
	it("should return a score with {passed, total}");
	it("should ")
});