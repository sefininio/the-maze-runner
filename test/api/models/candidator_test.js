const chai = require('chai');
const should = chai.should();
const Candidator = require('../../../server/api/models/candidator');

describe("Test the Candidators collection", () => {
	let benzi;
	it("Create a new candidator", (done) => {
		benzi = new Candidator({
			finalGrade: 10,
		});

		benzi.save()
			.then(() => Candidator.findOne({ finalGrade: 10 }))
			.then(candi => {
				candi.should.have.property('finalGrade', 10);
				done();
			});
	});
});