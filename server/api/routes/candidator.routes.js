const express = require('express');
const router = express.Router();
const CandidatorController = require('../controllers/candidator.controller');
 
router.get('/hc', CandidatorController.hc);

// router.get('/questions', CandidatorController.getQuestions);

// TODO - make it work with new mechanism -

/*router.post('/candidator/validate', cors(), (req, res) => {
	const {qid, codeToTest} = req.body;

	let tests;

	const baseURL = 'https://72vklh3hn2.execute-api.us-east-1.amazonaws.com';

	questionPoolHandler.getQuestionTests(qid)
		.then(question => question[0].tests)
		.then(tests => {
			return {
				baseURL,
				url: '/prod/validator',
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				data: {
					code: codeToTest,
					tests: tests
				}
			}
		})
		.then(options => {
			return axios(options)
		})
		.then(response => {
			const result = response.data;
			const score = questionPoolHandler.convertTestResultsToScore(result.passed, result.total);
			res.json({
				score
			});
		})
		.catch(error => {
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.log("response error")
				console.log('error.response.data', error.response.data);
				console.log('error.response.status', error.response.status);
				console.log('error.response.headers', error.response.headers);
				// res.json({
				// 	error: "Something went wrong",
				// });
				res.status(500).end();
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log("request error")
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("else error")
				console.log('Error', error.message);
			}
			console.log(error.config);
		});
});*/


module.exports = router;
