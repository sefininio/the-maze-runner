const chai = require('chai');
const should = chai.should();
const User = require('../../../server/api/models/user');

describe("Operations on the user collection", () => {
	let alex;

	// beforeEach((done) => {
	//
	// })
	// afterEach((done) => {
	// 	// console.log("***** AFTER EACH ******")
	// 	// console.log('p', p)
	// 	// done();
	// 	console.log('', )
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

	xit("Can handle saving an existing user situation", (done) => {
		const profile = {
			firstName: "Alex",
			lastName: "Raihelgaus",
			_profile: "Can handle saving an existing user situation",
			email: "alexr@tikalk.com"
		};

		UserController

		alex = new User(profile);

		alex.save()
			.then(savedAlex => console.log('savedAlex', savedAlex))
			.then(() => {
				const user = new User(profile);

				return user.save();

			})
			.then((what) => {
				console.log('what', what);
				done();
			})
			.catch(e => {
				console.log('@@@@@e.message', e);
				done();
			})

	});

	it("Can update the _profile prop", (done) => {
		alex = new User({
			firstName: "Alex",
			lastName: "Raihelgaus",
			_profile: "https://github.com/alexrtkl",
			email: "alexr@tikalk.com"
		});

		alex.save()
			.then(() => User.findOneAndUpdate({ email: "alexr@tikalk.com" }, { _profile: "http://ynet.co.il" }))
			.then(() => User.findOne({ email: 'alexr@tikalk.com' }))
			.then((user) => {
				user._profile.should.equal('http://ynet.co.il');
				// console.log('user', user)
				done();
			})
			.catch(e => console.log('e', e));
	});
});