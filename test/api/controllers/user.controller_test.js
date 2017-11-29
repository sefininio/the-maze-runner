const chai = require('chai');
const should = chai.should();
const mongoose = require('mongoose');
const User = mongoose.model('user');

describe("Testing the user controller functions", () => {
	it("Should be able to create a user in the users collection", (done) => {
		const user = new User({
			firstName: "Alex",
			lastName: "Raihelgaus",
			email: "alexr@tikalk.com",
		});

		user.save()
			.then(() => User.findOne({ email: 'alexr@tikalk.com' }))
			.then((savedUser) => {
				savedUser.firstName.should.equal("Alex");
				done();
			});
	});

});