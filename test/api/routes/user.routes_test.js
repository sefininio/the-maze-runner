const chai = require('chai');
const should = chai.should();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const chaiHttp = require('chai-http');
const app = require('../../../app');

chai.use(chaiHttp);

describe("Testing the user controller functions", () => {
	it.only("POST to /api/v1/user/auth/google should authenticate against google", (done) => {
		chai.request(app)
			.get('/api/v1/user/auth/google')
			.set('Content-Type', 'application/json')
			.send({
				hello: 'there',
			})
			.then(response => {
				console.log('response', response);
				response.should.equal('shit');
				done();
			})
			.catch(e => {
				console.warn('e.message', e.message);
				done();
			})
	})
});