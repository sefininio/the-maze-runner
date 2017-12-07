const express = require('express');
const router = express.Router();
// const dGenUtils = require('./../../utils/dungeon-generator');
// const dGenUtils = require('./../../utils/dungeon-generator');
const fs = require('fs');
const cors = require('cors');

let isCandidator = false;

const userErrorHandler = (req, res) => err => {
	console.log(`[${req.user.tikalId}]: ${err}`);
	res.sendStatus(400);
};

const mazeErrorHandler = (req, res) => err => {
	console.log(`[${req.params.mazeId}]: ${err}`);
	res.status(403).send({error: err.message});
};

router.get('/top-scores', (req, res) => {
	dGenUtils.topScores(5)
		.then(doc => res.send(doc))
		.catch(userErrorHandler(req, res));
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

module.exports = router;