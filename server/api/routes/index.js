const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const candidatorRoutes = require('./candidator.routes');
const passport = require('./../auth/passport');

// router.use('/', passport);

router.get('/hc', (req, res) => {
	res.json({
		status: "OK"
	});
});

router.use('/user', userRoutes);
router.use('/candidator', candidatorRoutes);

module.exports = router;