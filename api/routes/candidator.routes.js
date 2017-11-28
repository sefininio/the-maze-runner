const express = require('express');
const router = express.Router();
const CandidatorController = require('./../controllers/candidator.controller');

router.get('/hc', CandidatorController.hc);

// router.get('/questions', CandidatorController.getQuestions);


module.exports = router;
