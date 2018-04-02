const { readFileSync } = require('fs');
const { join } = require('path');
const uuid = require('uuid');
const { MongoClient } = require('mongodb');
const async = require('async');
const { url } = require('../conf/mongo');
const jsQuestions = require('./javascript/questions');

MongoClient.connect(url, (err, db) => {
    if (err) {
        return done(err);
    }

    const questions = db.collection('questionsPool');
    const jsQuestions_ = jsQuestions.map(q => {
        q._id = uuid.v4();
        const descriptionPath = join(__dirname, 'javascript', q.name, 'question.md');
        q.description = readFileSync(descriptionPath, 'utf-8');
        return q;
    });

    async.series([done => questions.deleteMany({}, done), done => questions.insertMany(jsQuestions_, done)], error => {
        if (error) {
            console.log(error);
        }
        console.log('done...');
    });
});
