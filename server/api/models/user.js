const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	// updatedAt: Date,
	// createdAt: Date,
	identifier: String,  //identifier is the string we look by according to platform.
	providerId: String,
	displayName: String,
	firstName: String,
	lastName: String,
	username: String,
	_profile: Object,
	// githubProfile: String,
	email: String,
	// email: {
		// type: String,
		// required: true,
		// unique: true,
		// validate: {
		// 	validator: (email) => name.length > 2,
		// 	message: 'User already exists'
		// }
	// },
	candidator: [{
		type: Schema.Types.ObjectId,
		ref: 'candidator'
	}],

	// photos: Array,
});


/*UserSchema.pre('save', true, function (next, done) {
	// console.log('arguments', arguments);
	const User = mongoose.model('user');
	// next();

	// return new Promise((resolve, reject) => {
	console.log('this.email', this.email)
	User.findOne({ email: this.email })
		.then((user) => {
			if (user) {
				console.log("User exists");
				reject({ message: "User email already exists" });

			} else {
				console.log("No such user");
				resolve(user);
			}
			done();
		})
		.catch(e => {
			if (e.code === 11000) {

			}
		});
})*/;

const User = mongoose.model('user', UserSchema);

module.exports = User;