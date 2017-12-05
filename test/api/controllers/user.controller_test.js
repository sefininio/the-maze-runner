const chai = require('chai');
const should = chai.should();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const UserController = require('./../../../server/api/controllers/user.controller');

describe("Testing the user controller functions", () => {
	it.only("Should be able to create a user in the users collection", (done) => {
		const userData = {
			firstName: "Alex",
			lastName: "Raihelgaus",
			email: "alexr@tikalk.com",
		};

		const user = new User(userData);


		UserController.createNewUser(user)
			.then(() => UserController.getUserByEmail(userData.email))
			.then((savedUser) => {
				console.log('savedUser', savedUser);
				savedUser.should.have.property('email', userData.email);
				done();
			});

	});

	it("Should be able to store new signed up google user", (done) => {
		UserController.signUpGoogle(googleProfileResponseUponSignUpSuccess)
			.then(() => User.findOne({ providerId: googleProfileResponseUponSignUpSuccess.id }))
			.then((savedUser) => {
				googleProfileResponseUponSignUpSuccess.displayName.should.equal(savedUser.firstName + ' ' + savedUser.lastName);
				done();
			})
			.catch(e => {
				console.log('e.message', e.message);
				done();
			})
	})
});

const googleProfileResponseUponSignUpSuccess = {
	id: '108074682163950900607',
	displayName: 'Alex Raihelgaus',
	name: { familyName: 'Raihelgaus', givenName: 'Alex' },
	emails: [{ value: 'alexr@tikalk.com', type: 'account' }],
	photos: [{ value: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50' }],
	gender: undefined,
	provider: 'google',
	_raw: '{\n "kind": "plus#person",\n "etag": "\\"ucaTEV-ZanNH5M3SCxYRM0QRw2Y/Dy7RrC38JIq6ZY7OZNMDlyvHVPs\\"",\n "emails": [\n  {\n   "value": "alexr@tikalk.com",\n   "type": "account"\n  }\n ],\n "objectType": "person",\n "id": "108074682163950900607",\n "displayName": "Alex Raihelgaus",\n "name": {\n  "familyName": "Raihelgaus",\n  "givenName": "Alex"\n },\n "image": {\n  "url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50",\n  "isDefault": true\n },\n "isPlusUser": false,\n "language": "en",\n "verified": false,\n "domain": "tikalk.com"\n}\n',
	_json:
		{
			kind: 'plus#person',
			etag: '"ucaTEV-ZanNH5M3SCxYRM0QRw2Y/Dy7RrC38JIq6ZY7OZNMDlyvHVPs"',
			emails: [[Object]],
			objectType: 'person',
			id: '108074682163950900607',
			displayName: 'Alex Raihelgaus',
			name: { familyName: 'Raihelgaus', givenName: 'Alex' },
			image:
				{
					url: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg?sz=50',
					isDefault: true
				},
			isPlusUser: false,
			language: 'en',
			verified: false,
			domain: 'tikalk.com'
		}
}