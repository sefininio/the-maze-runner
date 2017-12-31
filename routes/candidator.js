const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../src/db');

module.exports = () => {
    router.get('/questions/:tikalId', cors(), (req, res) => {
        db.getUserQuestions(req.params.tikalId).then(questions => {
            res.send(questions);
        });
    });

    return router;
};
