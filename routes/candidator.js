const express = require('express');
const router = express.Router();
const cors = require('cors');
const db = require('../src/db');
const { checkJwt } = require('../src/utils/auth0');
const jwtAuthz = require('express-jwt-authz');
const chai = require('chai');
const safeEval = require('safe-eval');
const path = require('path');
const hash = require('hash.js');

const checkScopes = jwtAuthz(['read:questions']);

const sessionId = token =>
    hash
        .sha256()
        .update(token)
        .digest('hex');

module.exports = () => {
    router.get(
        '/questions/:tikalId',
        cors(),
        checkJwt,
        checkScopes,
        (req, res) => {
            const session = sessionId(req.headers.authorization);
            db.getSession(req.params.tikalId).then(prevSession => {
                if (prevSession && prevSession !== session) {
                    return res.send(400); //don't allow second login after an answer was submitted
                }
                db.getUserQuestions(req.params.tikalId).then(questions => {
                    res.send(questions);
                });
            });
        }
    );

    router.get(
        '/attempts/:tikalId/:questionId',
        cors(),
        checkJwt,
        checkScopes,
        (req, res) => {
            db
                .countAttempts(req.params.tikalId, req.params.questionId)
                .then(attempts => {
                    res.send(attempts);
                });
        }
    );

    router.post('/submit-code', cors(), checkJwt, checkScopes, (req, res) => {
        const { code, questionId, tikalId, time } = req.body;
        const session = sessionId(req.headers.authorization);

        db
            .getUserQuestions(tikalId)
            .then(questions => questions.find(q => q._id === questionId))
            .then(question => {
                db
                    .countAttempts(tikalId, questionId)
                    .then(({ attempts }) => {
                        if (attempts >= question.attempts) {
                            throw new Error('Too many attempts');
                        }
                        return attempts;
                    })
                    .then(attempts => {
                        const f = safeEval(code);
                        // TODO - support different question subjects
                        const { test } = require(path.join(
                            '..',
                            'questions',
                            'javascript',
                            question.name,
                            'test'
                        ));
                        const testResult = {};
                        try {
                            test(f, chai);
                            testResult.pass = true;
                        } catch (err) {
                            testResult.pass = false;
                            testResult.error = err;
                        }
                        const answer = {
                            tikalId,
                            code,
                            question,
                            time,
                            session,
                            testResult,
                        };
                        db.saveCandidatorResponse(answer).then(() => {
                            testResult.attempts = attempts + 1;
                            res.send(testResult);
                        });
                    })
                    .catch(err => {
                        res.status(400);
                        res.send(err.message);
                    });
            });
    });
    return router;
};
