const chai = require('chai');
const should = chai.should();
const mongoose = require('mongoose');
const User = mongoose.model('user');
const UserController = require('./../../../server/api/controllers/user.controller');

describe("Testing the user controller functions", () => {
	it("Should be able to create a user in the users collection", (done) => {
		const userData = {
			firstName: "Alex",
			lastName: "Raihelgaus",
			email: "alexr@tikalk.com",
		};

		const user = new User(userData);


		UserController.createNewUser(user)
			.then(() => UserController.getUserByEmail(userData.email))
			.then((savedUser) => {
				savedUser.should.have.property('email', userData.email);
				done();
			});

	});

	it("Can handle saving an existing user situation", (done) => {
		const userData = {
			firstName: "Alex",
			lastName: "Raihelgaus",
			_profile: "Can handle saving an existing user situation",
			email: "alexr@tikalk.com"
		};

		UserController.createNewUser(userData)
			.then(() => {
				return UserController.createNewUser(userData);
			})
			.catch(e => {
				e.message.should.equal("User email already exists in DB");
				done();
			});
	});

	it("Should be able to store new signed up google user", (done) => {
		UserController.signUpGoogle(googleProfileResponseUponSignUpSuccess)
			.then(() => User.findOne({ providerId: googleProfileResponseUponSignUpSuccess.id }))
			.then((savedUser) => {
				googleProfileResponseUponSignUpSuccess.displayName.should.equal(savedUser.firstName + ' ' + savedUser.lastName);
				done();
			});

	});

	xit("Should be able to store new signed up github user that has an email", (done) => {
		UserController.signUpGitHub(githubProfileResponseUponSignUpSuccessWithEmail)
			.then(() => User.findOne({ providerId: githubProfileResponseUponSignUpSuccessWithEmail.id }))
			.then(savedUser => {
				console.log('savedUser', savedUser)
				githubProfileResponseUponSignUpSuccessWithEmail.displayName.should.equal(savedUser.firstName + ' @' + savedUser.lastName)
			})
	});
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
};

const githubProfileResponseUponSignUpSuccessNoEmail = {
	"id": "33661171",
	"displayName": null,
	"username": "alexrtkl",
	"profileUrl": "https://github.com/alexrtkl",
	"photos": [{ "value": "https://avatars2.githubusercontent.com/u/33661171?v=4" }],
	"provider": "github",
	"_raw": "{\"login\":\"alexrtkl\",\"id\":33661171,\"avatar_url\":\"https://avatars2.githubusercontent.com/u/33661171?v=4\",\"gravatar_id\":\"\",\"url\":\"https://api.github.com/users/alexrtkl\",\"html_url\":\"https://github.com/alexrtkl\",\"followers_url\":\"https://api.github.com/users/alexrtkl/followers\",\"following_url\":\"https://api.github.com/users/alexrtkl/following{/other_user}\",\"gists_url\":\"https://api.github.com/users/alexrtkl/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/alexrtkl/starred{/owner}{/repo}\",\"subscriptions_url\":\"https://api.github.com/users/alexrtkl/subscriptions\",\"organizations_url\":\"https://api.github.com/users/alexrtkl/orgs\",\"repos_url\":\"https://api.github.com/users/alexrtkl/repos\",\"events_url\":\"https://api.github.com/users/alexrtkl/events{/privacy}\",\"received_events_url\":\"https://api.github.com/users/alexrtkl/received_events\",\"type\":\"User\",\"site_admin\":false,\"name\":null,\"company\":null,\"blog\":\"\",\"location\":null,\"email\":null,\"hireable\":null,\"bio\":null,\"public_repos\":0,\"public_gists\":0,\"followers\":0,\"following\":0,\"created_at\":\"2017-11-14T14:10:57Z\",\"updated_at\":\"2017-12-06T07:45:17Z\"}",
	"_json": {
		"login": "alexrtkl",
		"id": 33661171,
		"avatar_url": "https://avatars2.githubusercontent.com/u/33661171?v=4",
		"gravatar_id": "",
		"url": "https://api.github.com/users/alexrtkl",
		"html_url": "https://github.com/alexrtkl",
		"followers_url": "https://api.github.com/users/alexrtkl/followers",
		"following_url": "https://api.github.com/users/alexrtkl/following{/other_user}",
		"gists_url": "https://api.github.com/users/alexrtkl/gists{/gist_id}",
		"starred_url": "https://api.github.com/users/alexrtkl/starred{/owner}{/repo}",
		"subscriptions_url": "https://api.github.com/users/alexrtkl/subscriptions",
		"organizations_url": "https://api.github.com/users/alexrtkl/orgs",
		"repos_url": "https://api.github.com/users/alexrtkl/repos",
		"events_url": "https://api.github.com/users/alexrtkl/events{/privacy}",
		"received_events_url": "https://api.github.com/users/alexrtkl/received_events",
		"type": "User",
		"site_admin": false,
		"name": null,
		"company": null,
		"blog": "",
		"location": null,
		"email": null,
		"hireable": null,
		"bio": null,
		"public_repos": 0,
		"public_gists": 0,
		"followers": 0,
		"following": 0,
		"created_at": "2017-11-14T14:10:57Z",
		"updated_at": "2017-12-06T07:45:17Z"
	}
};

const githubProfileResponseUponSignUpSuccessWithEmail = {
	"id": "5730102",
	"displayName": "Alexander Raihelgaus",
	"username": "ar7casper",
	"profileUrl": "https://github.com/ar7casper",
	"emails": [{ "value": "alex.raihel@gmail.com" }],
	"photos": [{ "value": "https://avatars1.githubusercontent.com/u/5730102?v=4" }],
	"provider": "github",
	"_raw": "{\"login\":\"ar7casper\",\"id\":5730102,\"avatar_url\":\"https://avatars1.githubusercontent.com/u/5730102?v=4\",\"gravatar_id\":\"\",\"url\":\"https://api.github.com/users/ar7casper\",\"html_url\":\"https://github.com/ar7casper\",\"followers_url\":\"https://api.github.com/users/ar7casper/followers\",\"following_url\":\"https://api.github.com/users/ar7casper/following{/other_user}\",\"gists_url\":\"https://api.github.com/users/ar7casper/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/ar7casper/starred{/owner}{/repo}\",\"subscriptions_url\":\"https://api.github.com/users/ar7casper/subscriptions\",\"organizations_url\":\"https://api.github.com/users/ar7casper/orgs\",\"repos_url\":\"https://api.github.com/users/ar7casper/repos\",\"events_url\":\"https://api.github.com/users/ar7casper/events{/privacy}\",\"received_events_url\":\"https://api.github.com/users/ar7casper/received_events\",\"type\":\"User\",\"site_admin\":false,\"name\":\"Alexander Raihelgaus\",\"company\":null,\"blog\":\"\",\"location\":\"Israel\",\"email\":\"alex.raihel@gmail.com\",\"hireable\":null,\"bio\":null,\"public_repos\":10,\"public_gists\":0,\"followers\":1,\"following\":2,\"created_at\":\"2013-10-20T11:47:03Z\",\"updated_at\":\"2017-12-06T08:14:04Z\"}",
	"_json": {
		"login": "ar7casper",
		"id": 5730102,
		"avatar_url": "https://avatars1.githubusercontent.com/u/5730102?v=4",
		"gravatar_id": "",
		"url": "https://api.github.com/users/ar7casper",
		"html_url": "https://github.com/ar7casper",
		"followers_url": "https://api.github.com/users/ar7casper/followers",
		"following_url": "https://api.github.com/users/ar7casper/following{/other_user}",
		"gists_url": "https://api.github.com/users/ar7casper/gists{/gist_id}",
		"starred_url": "https://api.github.com/users/ar7casper/starred{/owner}{/repo}",
		"subscriptions_url": "https://api.github.com/users/ar7casper/subscriptions",
		"organizations_url": "https://api.github.com/users/ar7casper/orgs",
		"repos_url": "https://api.github.com/users/ar7casper/repos",
		"events_url": "https://api.github.com/users/ar7casper/events{/privacy}",
		"received_events_url": "https://api.github.com/users/ar7casper/received_events",
		"type": "User",
		"site_admin": false,
		"name": "Alexander Raihelgaus",
		"company": null,
		"blog": "",
		"location": "Israel",
		"email": "alex.raihel@gmail.com",
		"hireable": null,
		"bio": null,
		"public_repos": 10,
		"public_gists": 0,
		"followers": 1,
		"following": 2,
		"created_at": "2013-10-20T11:47:03Z",
		"updated_at": "2017-12-06T08:14:04Z"
	}
}

