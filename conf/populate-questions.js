const bdUrl = require('../conf/mongo').url;
const mongoClient = require('mongodb').MongoClient;
const jsQuestions = require('./questions/js-questions');
const uuid = require('uuid');
const async = require('async');

mongoClient.connect(bdUrl, (err, db) => {
    if (err) {
        return done(err);
    }

    const questions = db.collection('questionsPool');
    const jsQuestions_ = jsQuestions.map(q => {
        q._id = uuid.v4();
        return q;
    });

    async.series([done => questions.deleteMany({}, done), done => questions.insertMany(jsQuestions_, done)], error => {
        if (error) {
            console.log(error);
        }
        console.log('done...');
    });
});
