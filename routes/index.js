const express = require('express');
const router = express.Router();
const Dungeon = require('../src/dungeon-generator/');

module.exports = (passport) => {
    /* GET home page. */
    router.get('/', (req, res, next) => {
        res.redirect('/auth/google');
    });

    router.get('/generate', isLoggedIn, (req, res) => {
        let dungeon = new Dungeon().generate().persistAndReset();
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
    router.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/generate',
        failureRedirect: '/'
    }));

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }

    return router;
};
