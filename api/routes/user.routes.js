const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.send({
		where: 'in user.routes.js'
	});
});

module.exports = router;