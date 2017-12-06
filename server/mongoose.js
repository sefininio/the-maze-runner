const mongoose = require('mongoose');
const dbURL = require('./../conf/mongo').url;

mongoose.Promise = global.Promise;

module.exports = {
	connect() {

		return new Promise((resolve, reject) => {
			mongoose.connect(dbURL, {
				useMongoClient: true,
			});

			mongoose.connection
				.once('open', () => {
					console.log('`connected to ${dbURL} DB`', `connected to ${dbURL} DB`);
					resolve();

				})
				.on('error', error => {
					console.warn("Error", error);
					reject(error);
					// res.send("Error");
				});
		})

	}
};

