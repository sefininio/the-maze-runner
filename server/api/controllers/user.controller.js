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
				console.log('doesEmailExist', doesEmailExists)
				if (doesEmailExists) {
					return Promise.reject({ message: '@User email in DB' })
				}
			})
			.then(() => newUser.save());


		// return newUser.save();
	},

	getUserByEmail(email) {
		return User.findOne({ email });
	},

	saveUser(user) {
		const newUser = new User(user);

		return newUser.save()
			.catch(e => {
				if (e.code === 11000) {
					return Promise.reject({ message: "User email already exists" });
				} else {
					return Promise.reject(e);
				}
			})
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

		return this.saveUser(userData);
	},

	signUp(type) {
		return (profile) => {
			const newUser = new User({
				_profile: profile,

			});


		}
	}

};
