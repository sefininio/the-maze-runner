const express = require('express');
const router = express.Router();
const dGen = require('../src/dungeon-generator/');

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
        dGen.generate(req.user)
            .then(pDungeonObj => res.send(pDungeonObj))
            .catch(err => res.send(err));
    });

    router.get('/room/:roomId/describe', isLoggedIn, (req, res) => {
        dGen.getRoomDescription(req.user.tikalId ,req.params.roomId)
            .then(description => res.send({description: description}))
            .catch(err => res.send(err));
    });

    router.get('/room/:roomId/exits', isLoggedIn, (req, res) => {
        dGen.getRoomExitDirections(req.user.tikalId ,req.params.roomId)
            .then(exits => res.send({exits: exits}))
            .catch(err => res.send(err));
    });

    router.get('/room/:roomId/exit/:direction', isLoggedIn, (req, res) => {
        dGen.exitRoom(req.user.tikalId, req.params.roomId, req.params.direction)
            .then(nextRoomId => res.send({nextRoomId: nextRoomId}))
            .catch(err => res.send(err));
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
