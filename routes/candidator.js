const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../src/db');
const { checkJwt } = require('../src/utils/auth0');
const jwtAuthz = require('express-jwt-authz');
const chai = require('chai');
const safeEval = require('safe-eval');

const checkScopes = jwtAuthz(['read:questions']);

module.exports = () => {
    router.get('/questions/:tikalId', cors(), checkJwt, checkScopes, (req, res) => {
        db.getUserQuestions(req.params.tikalId).then(questions => {
            res.send(questions);
        });
    });

    router.post('/submit-code', cors(), checkJwt, checkScopes, (req, res) => {
        const { code, questionId, tikalId } = req.body;

        db
            .getUserQuestions(tikalId)
            .then(questions => {
                const question = questions.find(q => q._id === questionId);
                return question;
            })
            .then(question => {
                const f = safeEval(code);
                const q = safeEval(question.tests[0]);
                try {
                    q(f, chai);
                } catch (err) {
                    return res.send({
                        pass: false,
                    });
                }
                res.send({
                    pass: true,
                });
            });
    });
    return router;
};
