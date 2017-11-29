const chai = require('chai');
const should = chai.should();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const chaiHttp = require('chai-http');
const app = require('../../../app');

chai.use(chaiHttp);

describe("Testing the user controller functions", () => {
	it("GET to /api/v1/user/auth should authenticate", (done) => {

	})
});