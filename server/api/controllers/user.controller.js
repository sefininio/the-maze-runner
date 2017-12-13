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
		return new Promise((resolve, reject) => {
			User.findOne({ email })
				.then(doesEmailExists => {
					if (doesEmailExists) {
						return Promise.reject({ message: 'User email already exists in DB' })
					}
				})
				.then(() => newUser.save())
				.then((savedUser) => {
					// console.log('@@@savedUser', savedUser);
					resolve(savedUser);
				})
				.catch(e => {
					console.log('e', e);
					reject(e);
				});

		})
	},

	getUserByEmail(email) {
		return User.findOne({ email });
	},

	getUserByIdentifier(identifier) {
		return User.findOne({ identifier });
	},

	signUpGoogle(profile) {
		const { id, name, emails, provider } = profile;

		const { givenName: firstName, familyName: lastName } = name;
		const email = emails[0].value;

		const userData = {
			identifier: email,
			_profile: profile,
			firstName,
			lastName,
			email,
			provider,
			providerId: id,
		};

		return this.createNewUser(userData);
	},

	lookupGoogle(userObjOrEmail) {
		// data could be string or object with emailproanything.

		const email = userObjOrEmail.email || userObjOrEmail || null;

		if (!email) {
			const error = {
				message: "Can't lookup a google user without an email",
				emailReceived: email,
			};
			return errorl
		}

		return new Promise((resolve, reject) => {
			this.getUserByIdentifier(email)
				.then(user => {
					// console.log('user in userController.lookupGoogle', user);
					if (!user) {
						reject({ message: "No matching email" });
					} else {
						resolve(user);
					}
				})
				.catch(e => {
					console.log('e.in userController.lookupGoogle', e);
					reject(e);
				});
		});
	},

	signUpGitHub(profile) {
		const { id, name, username, provider } = profile;

		const userData = {
			identifier: username,
			username: username,
			_profile: profile,
		};

		return this.createNewUser(userData);
	},

	lookupGithub(username) {
		if (!username) {
			const error = {
				message: "Can't lookup a github user without an email",
				usernameReceived: username,
			};
			return error;
		}

		return new Promise((resolve, reject) => {
			this.getUserByIdentifier(username)
				.then(user => {
					// console.log('user in lookupGoogle', user);
					if (!user) {
						reject({ message: "No matching username" });
					} else {
						resolve(user);
					}
				})
				.catch(e => reject(e));

		})
	},

	signupFacebook(profile) {
		const { id, displayName } = profile;

		const userData = {
			identifier: id,
			fid: id,
			displayName,
			_profile: profile,
		};

		return this.createNewUser(userData);
	},

	lookupFacebook(fid) {
		if (!fid) {
			const error = {
				message: "Can't lookup facebook user without an id",
				idReceieved: fid,
			};

			return error;
		}

		return new Promise((resolve, reject) => {
			this.getUserByIdentifier(fid)
				.then(user => {
					if (!user) {
						reject({ message: "No mattching facebook id" });
					} else {
						resolve(user);
					}
				})
				.catch(e => reject(e));
		})
	},

	signUp(type) {
		return (profile) => {
			const newUser = new User({
				_profile: profile,

			});


		}
	}

};
