const express = require('express');
const router = express.Router();
const dGenUtils = require('../src/dungeon-generator');
const fs = require('fs');
const cors = require('cors');
const http = require('http');
const querystring = require('querystring');
const axios = require('axios');
const questionPoolHandler = require('../src/db/questionPoolHandlers');

let isCandidator = false;

module.exports = (passport) => {
	/* GET home page. */

	const authCallbackObj = {
		successRedirect: '/start',
		failureRedirect: '/'
	};

	const userErrorHandler = (req, res) => err => {
		console.log(`[${req.user.tikalId}]: ${err}`);
		res.sendStatus(400);
	};

	const mazeErrorHandler = (req, res) => err => {
		console.log(`[${req.params.mazeId}]: ${err}`);
		res.status(403).send({error: err.message});
	};

	router.get('/', (req, res, next) => {
		isCandidator = req.query.q && req.query.q === '1';
		res.render('index');
	});

	router.get('/top-scores', (req, res) => {
		dGenUtils.topScores(5)
			.then(doc => res.send(doc))
			.catch(userErrorHandler(req, res));
	});

	router.get('/start', isLoggedIn, (req, res, next) => {
		res.render('start');
	});

	router.get('/timi', isLoggedIn, (req, res, next) => {
		dGenUtils.getClue(req.user)
			.then((resClue) => {
				res.send(resClue.clue[1]);
			})
			.catch(userErrorHandler(req, res));
	});

	router.get('/start-clue', isLoggedIn, (req, res, next) => {
		dGenUtils.getClue(req.user)
			.then((resClue) => {
				res.send(resClue.clue[2]);
			})
			.catch(userErrorHandler(req, res));
	});

	router.get('/text/:name', isLoggedIn, (req, res, next) => {
		fs.readFile('src/static/' + req.params.name + '.txt', 'utf8', function (err, data) {
			if (err) res.sendStatus(404);
			if (req.params.name === 'start') {
				dGenUtils.getClue(req.user)
					.then((resClue) => {
						data = data.replace('<CLUE>', resClue.clue[0]);
						res.send(data);
					})
					.catch(userErrorHandler(req, res));

			} else {
				res.send(data);
			}
		});
	});

	router.get('/generate', isLoggedIn, (req, res) => {
		dGenUtils.generate(req.user)
			.then(() => res.render('welcome'))
			.catch(userErrorHandler(req, res));
	});

	router.get('/maze-id', isLoggedIn, (req, res) => {
		res.send(req.user.tikalId);
	});

	router.get('/maze/:mazeId/reset', cors(), updateApiCount, (req, res) => {
		dGenUtils.reset(req.params.mazeId)
			.then(description => res.send(description))
			.catch(mazeErrorHandler(req, res));
	});

	router.get('/maze/:mazeId/describe', cors(), updateApiCount, (req, res) => {
		dGenUtils.getRoomDescription(req.params.mazeId)
			.then(description => res.send(description))
			.catch(mazeErrorHandler(req, res));
	});

	router.get('/maze/:mazeId/exits', cors(), updateApiCount, (req, res) => {
		dGenUtils.getRoomExits(req.params.mazeId)
			.then(exits => res.send(exits))
			.catch(mazeErrorHandler(req, res));
	});

	router.get('/maze/:mazeId/exit/:direction', cors(), updateApiCount, (req, res) => {
		dGenUtils.exitRoom(req.params.mazeId, req.params.direction)
			.then(newRoomId => res.send(newRoomId))
			.catch(mazeErrorHandler(req, res));
	});

	router.get('/maze/:mazeId/validate/:hash', cors(), updateApiCount, (req, res) => {
		dGenUtils.validate(req.params.mazeId, req.params.hash)
			.then(verified => res.send(verified))
			.catch(mazeErrorHandler(req, res));
	});

	router.get('/maze/:mazeId/beat-monster/:comeback', cors(), updateApiCount, (req, res) => {
		dGenUtils.beatMonster(req.params.mazeId, req.params.comeback)
			.then(desc => res.send(desc))
			.catch(mazeErrorHandler(req, res));
	});

	router.get('/insult/:insult', cors(), (req, res) => {
		dGenUtils.getInsultResponse(req.params.insult)
			.then(response => res.send(response))
			.catch(mazeErrorHandler(req, res));
	});

	router.get('/logout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/:clue', isLoggedIn, (req, res, next) => {
		// default route that is not '/'
		// this MUST be the last route defined, otherwise it'll override other routes.
		// it will either redirect to '/generate' if the clue is correct
		// or redirect back to '/start' since the clue is incorrect
		dGenUtils.getClue(req.user)
			.then(resClue => {
				if (req.params.clue === resClue.clue.join('')) {
					console.log('isCandidator', isCandidator);
					if (isCandidator) {
						res.redirect('http://localhost:3001');
					} else {
						res.redirect('/generate');
					}
				} else {
					res.redirect('/start');
				}
			})
			.catch(userErrorHandler(req, res));
	});

	router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
	router.get('/auth/google/callback', passport.authenticate('google', authCallbackObj));

	router.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', authCallbackObj));

	router.get('/auth/github', passport.authenticate('github', {scope: 'user:email'}));
	router.get('/auth/github/callback', passport.authenticate('github', authCallbackObj));

	router.get('/candidator/questions', (req, res) => {
		questionPoolHandler.getNRandomQuestions(5)
			.then(questions => {
				console.log('questions.length', questions.length);
				console.log('questions', questions);
				res.send(questions);
			})
			.catch(e => {
				console.log('e', e);
				res.send(e.message);
			});
	});

	router.post('/candidator/validate', cors(), (req, res) => {
		console.log("ppppppppppppp")
		// const post_data = querystring.stringify({
		// 	'code': req.body.code,
		// 	"tests": [
		// 		{"assert": "equal", "input": [2, 3], "expected": 5},
		// 		{"assert": "equal", "input": [0, 0], "expected": 0},
		// 		{"assert": "equal", "input": [-1, 2], "expected": 1},
		// 		{"assert": "equal", "input": [-1, -1], "expected": -2},
		// 		{"assert": "equal", "input": [1, "hello"], "expected": "1hello"}
		// 	]
		// });

		const codeToTest = req.body.code;
		// const qid = req.body.qid


		questionPoolHandler.getAllQuestions()
			.then(questions => {
				console.log('total number of questions chosen', questions.length);
				res.send(questions);
			})
			.catch(e => {
				console.log('e', e);
				res.send(e.message);
			});



		const baseURL = 'https://72vklh3hn2.execute-api.us-east-1.amazonaws.com';

		const options = {
			baseURL,
			url: '/prod/validator/',
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Content-Length': 2048,//Buffer.byteLength(post_data)
			},
			// data: post_data,
			data:{
				"code": "(a,b) => a + b;",
				"tests": [
					{ "assert": "equal", "input": [2, 3], "expected": 5},
					{ "assert": "equal", "input": [0, 0], "expected": 0},
					{ "assert": "equal", "input": [-1, 2], "expected": 1},
					{ "assert": "equal", "input": [-1, -1], "expected": -2},
					{ "assert": "equal", "input": [1, "hello"], "expected": "1hello"}
				]
			}
		};

/*
		axios(options)
			.then(response => {
				console.log('response', response.data);
				return response.data;
			})
			.then((answer) => res.send(answer))
			.catch(error => {
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					console.log("response error")
					console.log(error.response.data);
					console.log(error.response.status);
					console.log(error.response.headers);
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
*/
	});

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}

		res.redirect('/');
	}

	function updateApiCount(req, res, next) {
		dGenUtils.updateApiCount(req.params.mazeId)
			.then(() => next())
			.catch(mazeErrorHandler(req, res));
	}

	return router;
};
