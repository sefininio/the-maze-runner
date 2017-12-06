const User = require('../models/user');
const passport = require('passport');

const scopes = {
	google: ['profile', 'email'],
	facebook: 'email',
	github: 'user:email'
};

const authCallbackObj = {
	successRedirect: '/start',
	failureRedirect: '/'
};

module.exports = {
	auth(type) {
		return passport.authenticate(type, { scope: scopes[type] });
	},

	authConfirmation(type) {
		return passport.authenticate(type, authCallbackObj);
	},

	createNewUser(userData) {
		const newUser = new User(userData);

		const { email } = userData;

		// Query DB to check that email doesn't exist.
		return User.findOne({ email })
			.then(doesEmailExists => {
				if (doesEmailExists) {
					return Promise.reject({ message: 'User email already exists in DB' })
				}
			})
			.then(() => newUser.save())
			.then((savedUser) => console.log('@@@savedUser', savedUser));
	},

	getUserByEmail(email) {
		return User.findOne({ email });
	},

	signUpGoogle(profile) {
		const { id, name, emails, provider } = profile;

		const { givenName: firstName, familyName: lastName } = name;
		const email = emails[0].value;

		const userData = {
			_profile: profile,
			firstName,
			lastName,
			email,
			provider,
			providerId: id,
		};

		return this.createNewUser(userData);
	},

	signUpGitHub(profile) {
		const { id, name, username, provider } = profile;

		const userData = {
			_profile: profile,
		};

		return this.createNewUser(userData);



	},

	signUp(type) {
		return (profile) => {
			const newUser = new User({
				_profile: profile,

			});


		}
	}

};
