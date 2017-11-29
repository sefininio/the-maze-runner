const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	// updatedAt: Date,
	// createdAt: Date,
	firstName: String,
	lastName: String,
	githubProfile: String,
	email: {
		type: String,
		required: true,
	},
	candidator: [{
		type: Schema.Types.ObjectId,
		ref: 'candidator'
	}],

	// photos: Array,
});

// UserSchema.post('save', function(next) {
// 	const User = mongoose.model('user');
//
// 	User.createdAt = new Date();
// 	User.updatedAt = new Date();
// 	next();
// });

const User = mongoose.model('user', UserSchema);

module.exports = User;