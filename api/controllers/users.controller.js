const User = require('./../models/user');
const passport = require('passport');

module.exports = {
	auth(req, res) {
		console.log('req.body', req.body);
		console.log("auth");
	},

	authConfirmation() {
		console.log("authConfirmation")
	},
};