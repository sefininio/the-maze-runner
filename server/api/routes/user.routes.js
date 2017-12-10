const express = require('express');
const router = express.Router();
const passport = require('passport');

const UserController = require('../controllers/user.controller');


const authCallbackObj = {
	successRedirect: '/start',
	failureRedirect: '/'
};


router.get('/', (req, res) => {
	res.send({
		where: 'in user.routes_test.js'
	});
});

router.get('/fail', (req, res) => {
	res.send({
		where: 'AUTH Failure /fail'
	});
});

// console.log('UserController.auth', UserController.auth)

router.get('/auth/google', UserController.auth('google'));
router.get('/auth/facebook', UserController.auth('facebook'));
router.get('/auth/github', UserController.auth('github'));
router.get('/auth/google/callback', UserController.authConfirmation('google'));
router.get('/auth/facebook/callback', UserController.authConfirmation('facebook'));
router.get('/auth/github/callback', UserController.authConfirmation('github'));

module.exports = router;