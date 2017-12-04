const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionPoolSchema = new Schema({
	heroImage: String,
	description: String,
	// tests: [{
	// 	assert: String,
		// Expected type could be something other than String
		// expected: String,
	// }]
});

const QuestionPool = mongoose.model('questionPool', QuestionPoolSchema);

module.exports = QuestionPool;