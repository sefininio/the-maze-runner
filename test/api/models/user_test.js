const chai = require('chai');
const should = chai.should();
const User = require('../../../api/models/user');

describe("Operations on the user collection", () => {
	let alex;

	// beforeEach((done) => {
	//
	// })
	it("Can create a new user", (done) => {
		alex = new User({
			firstName: "Alex",
			lastName: "Raihelgaus",
			githubProfile: "https://github.com/alexrtkl",
			email: "alexr@tikalk.com"
		});

		alex.save()
			.then(() => {
				alex.isNew.should.be.false;
				done();
			});
	});

	it("Can update the gitHubProfile prop", (done) => {
		alex = new User({
			firstName: "Alex",
			lastName: "Raihelgaus",
			githubProfile: "https://github.com/alexrtkl",
			email: "alexr@tikalk.com"
		});

		alex.save()
			.then(() => User.findOneAndUpdate({ email: "alexr@tikalk.com" }, { githubProfile: "http://ynet.co.il" }))
			.then(() => User.findOne({ email: 'alexr@tikalk.com' }))
			.then((user) => {
				user.githubProfile.should.equal('http://ynet.co.il');
				// console.log('user', user)
				done();
			})
			.catch(e => console.log('e', e));
	});
});