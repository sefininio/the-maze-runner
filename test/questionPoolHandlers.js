const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');
const DB = require('./../src/db/index');
// const bdUrl = require('../../conf/mongo').url;
const questionPoolHandlers = require('./../src/db/questionPoolHandlers');

chai.use(chaiHttp);

before((done) => {
	DB.connect(done);
});

describe('test questionPoolHandlers functions', () => {
	it("getQuestionTests should retrieve the tests for a question by id as array", (done) => {
		questionPoolHandlers.getQuestionTests("5a0d6349f3b6ddc1f3e6e048")
			.then(res => {
				res.should.be.an('array');
				res.length.should.equal(1);
				res[0].should.have.property('tests');
				res[0].tests.length.should.equal(5);
			})
			.then(() =>{
				done();
			});
	});
});

