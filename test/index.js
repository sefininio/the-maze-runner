const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
	mongoose.connect('mongodb://localhost/maze-tests', {
		useMongoClient: true,
	});
	mongoose.connection
		.once('open', () => {
			console.log("Connected to maze-tests DB");
			done();
		})
		.on('error', (error) => {
			console.warn("Error", error);
		});
});

beforeEach((done) => {
	const { users, candidators, questionpools } = mongoose.connection.collections;

	users.drop(() => {
		questionpools.drop(() => {
			candidators.drop(() => {
				done();
			});
		});
	});
});