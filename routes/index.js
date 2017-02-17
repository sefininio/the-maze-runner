const express = require('express');
const router = express.Router();
const Dungeon = require('../src/dungeon-generator/');

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
        let dungeon = new Dungeon().generate().persistAndReset();
        req.user.tikalId = `${req.user.id}_${req.user.provider}`;
        let response = {
            hash: dungeon.hash,
            dungeon: dungeon.dungeon,
            user: req.user
        };
        res.send(response);
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
