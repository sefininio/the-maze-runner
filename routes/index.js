const express = require('express');
const router = express.Router();
const dGenUtils = require('../src/dungeon-generator');
const quests = require('../quests.json').quests;

module.exports = (passport) => {
    /* GET home page. */

    const authCallbackObj = {
        successRedirect: '/generate',
        failureRedirect: '/'
    };

    router.get('/', (req, res, next) => {
        res.render('index');
    });

    router.get('/generate', isLoggedIn, (req, res) => {
        dGenUtils.generate(req.user, quests)
            .then(firstRoomId => res.send(firstRoomId))
            .catch(err => {
                console.log(`[${req.user.tikalId}]: ${err}`);
                res.status(500).send(err);
            });
    });

    router.get('/room/:roomId/describe', isLoggedIn, (req, res) => {
        dGenUtils.getRoomDescription(req.user.tikalId ,req.params.roomId)
            .then(description => res.send(description))
            .catch(err => {
                console.log(`[${req.user.tikalId}]: ${err}`);
                res.status(500).send(err);
            });
    });

    router.get('/room/:roomId/exits', isLoggedIn, (req, res) => {
        dGenUtils.getRoomExits(req.user.tikalId ,req.params.roomId)
            .then(exits => res.send(exits))
            .catch(err => {
                console.log(`[${req.user.tikalId}]: ${err}`);
                res.status(500).send(err);
            });
    });

    router.get('/room/:roomId/exit/:direction', isLoggedIn, (req, res) => {
        dGenUtils.exitRoom(req.user.tikalId, req.params.roomId, req.params.direction)
            .then(newRoomId => res.send(newRoomId))
            .catch(err => {
                console.log(`[${req.user.tikalId}]: ${err}`);
                res.status(500).send(err);
            });
    });

    router.get('/validate/:hash', isLoggedIn, (req, res) => {
        dGenUtils.validate(req.user.tikalId, req.params.hash)
            .then(verified => res.send(verified))
            .catch(err => {
                console.log(`[${req.user.tikalId}]: ${err}`);
                res.status(500).send(err);
            });
    });

    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    router.get('/auth/google/callback', passport.authenticate('google', authCallbackObj));

    router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));
    router.get('/auth/facebook/callback', passport.authenticate('facebook', authCallbackObj));

    router.get('/auth/github', passport.authenticate('github', { scope: 'user:email'}));
    router.get('/auth/github/callback', passport.authenticate('github', authCallbackObj));

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }

    return router;
};
