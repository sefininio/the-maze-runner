'use strict';

const tap = require('tap');

exports.handler = (event, context, callback) => {
	const body = JSON.parse(event.body);
	const func = eval(body.code);
	const total = body.tests.length;
	let passed = 0;

	body.tests.map(test => {
		if (tap[test.assert](func.apply(this, test.input), test.expected)) passed++;
	});

	callback(null, {
		"statusCode": 200,
		"body": JSON.stringify({
			"passed": passed,
			"total": total
		})
	});
};