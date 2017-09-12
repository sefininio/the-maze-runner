const tap = require('tap');
const code = require('./' + process.argv[2]);
const tests = require('./tests.json');
const questions = process.argv[3].split(',');

let passed = 0;
const expected = questions.length;

if (code) {
	questions.map(question => {
		if (code[question]) {
			const func = code[question];
			const result = Array.isArray(tests[question].input) ? func.apply(this, tests[question].input) : func(tests[question].input);

			if (tap.equal(result, tests[question].expected)) passed++;
		}
	});

	process.send({
		passed: passed,
		expected: expected
	});
}
