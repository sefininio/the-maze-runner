const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user.controller');


const authCallbackObj = {
	successRedirect: '/start',
	failureRedirect: '/'
};


router.get('/', (req, res) => {
	res.send({
		where: 'in user.routes.js'
	});
});

router.get('/auth/:type', UserController.auth);
router.get('/auth/:type/callback', UserController.authConfirmation);

module.exports = router;