'use strict';

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const childProcess = require('child_process');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/validate/:mazeId', (req, res, next) => {
	fs.writeFile(req.params.mazeId + '.js', req.body.code, () => {
		const forked = childProcess.fork(__dirname + '/tests.js', [req.params.mazeId + '.js', req.body.questions]);

		forked.on('message', msg => {
			res.status(200).send(msg);
			next();
		});
	});
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);