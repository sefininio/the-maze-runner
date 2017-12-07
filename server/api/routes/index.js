const express = require('express');
const router = express.Router();
const userRoutes = require('./user.routes');
const candidatorRoutes = require('./candidator.routes');
const mazeRoutes = require('./maze.routes');
const passport = require('./../auth/passport');

// router.use('/', passport);

router.get('/hc', (req, res) => {
	res.json({
		status: "OK"
	});
});

router.use('/user', userRoutes);
router.use('/candidator', candidatorRoutes);
router.use('/maze', mazeRoutes);

module.exports = router;