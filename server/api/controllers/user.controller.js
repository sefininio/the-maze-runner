const User = require('../models/user');
// const passport = require('../../../passport');
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
	auth(req, res) {
		console.log("auth");
		console.log('req.body', req.body);

		// console.log('user.controller.js passport', passport);
		const { type } = req.params;
		console.log('scopes[type]', scopes[type]);
		passport.authenticate(type, { scope: scopes[type] });
		console.log('type', type);
	},

	authConfirmation(req, res) {
		console.log("authConfirmation");

		const { type } = req.params;
		passport.authenticate(type, authCallbackObj)
	},
};
/*

router.get('/auth/google', ()=> {
	console.log('routes/index.js passport', passport);
	passport.authenticate('google', {scope: ['profile', 'email']})
});
router.get('/auth/google/callback', passport.authenticate('google', authCallbackObj));*/
