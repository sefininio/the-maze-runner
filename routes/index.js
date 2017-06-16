const express = require('express');
const router = express.Router();
const dGenUtils = require('../src/dungeon-generator');
const quests = require('../quests.json').quests;
const fs = require('fs');

module.exports = (passport) => {
    /* GET home page. */

    const authCallbackObj = {
        successRedirect: '/start',
        failureRedirect: '/'
    };

    const userErrorHandler = (req, res) => err => {
        console.log(`[${req.user.tikalId}]: ${err}`, err);
        res.sendStatus(400);
    }

    const mazeErrorHandler = (req, res) => err => {
        console.log(`[${req.params.mazeId}]: ${err}`, err);
        res.status(403).send({error: err});
    }

    router.get('/', (req, res, next) => {
        res.render('index');
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
        dGenUtils.generate(req.user, quests)
            .then(() => res.render('welcome'))
            .catch(userErrorHandler(req, res));
    });

    router.get('/maze-id', isLoggedIn, (req, res) => {
        res.send(req.user.tikalId);
    });

    router.get('/maze/:mazeId/currentRoom', (req, res) => {
        dGenUtils.getCurrentRoom(req.params.mazeId)
            .then(description => res.send(description))
            .catch(mazeErrorHandler(req, res));
    });

    router.get('/maze/:mazeId/room/:roomId/describe', (req, res) => {
        dGenUtils.getRoomDescription(req.params.mazeId, req.params.roomId)
            .then(description => res.send(description))
            .catch(mazeErrorHandler(req, res));
    });

    router.get('/maze/:mazeId/room/:roomId/exits', (req, res) => {
        dGenUtils.getRoomExits(req.params.mazeId, req.params.roomId)
            .then(exits => res.send(exits))
            .catch(mazeErrorHandler(req, res));
    });

    router.get('/maze/:mazeId/room/:roomId/exit/:direction', (req, res) => {
        dGenUtils.exitRoom(req.params.mazeId, req.params.roomId, req.params.direction)
            .then(newRoomId => res.send(newRoomId))
            .catch(mazeErrorHandler(req, res));
    });

    router.get('/maze/:mazeId/validate/:hash', (req, res) => {
        dGenUtils.validate(req.params.mazeId, req.params.hash)
            .then(verified => res.send(verified))
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
                    res.redirect('/generate');
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

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }

    return router;
};
