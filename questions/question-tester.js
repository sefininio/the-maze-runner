const questions = require('./javascript/questions');
const chai = require('chai');
const sinon = require('sinon');

questions.forEach(q => {
    const { fn } = require(`./javascript/${q.name}/solution`);
    const { test } = require(`./javascript/${q.name}/test`);
    if (!fn) return;
    try {
        test(fn, chai, sinon);
        console.log(`passed ${q.name}`);
    } catch (err) {
        console.log(err);
    }
});
