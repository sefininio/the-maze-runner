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
};
