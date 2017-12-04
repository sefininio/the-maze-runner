const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const config = require('./../../../conf/oauth');


const passportConfig = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.serializeUser((user, done) => {
		done(null, user);
	});

	passport.deserializeUser((user, done) => {
		done(null, user);
	});

	passport.use(new GoogleStrategy({
			clientID: config.google.client_id,
			clientSecret: config.google.client_secret,
			callbackURL: config.google.redirect_uri,
		},
		(token, refreshToken, profile, done) => {
			process.nextTick(() => {
				return done(null, {name: true});
			});
		}));

	passport.use(new FacebookStrategy({
			clientID: config.facebook.client_id,
			clientSecret: config.facebook.client_secret,
			callbackURL: config.facebook.redirect_uri,
		},
		(token, refreshToken, profile, done) => {
			process.nextTick(() => {
				return done(null, profile);
			});
		}));

	passport.use(new GitHubStrategy({
			clientID: config.github.client_id,
			clientSecret: config.github.client_secret,
			callbackURL: config.github.redirect_uri,
		},
		(token, refreshToken, profile, done) => {
			process.nextTick(() => {
				return done(null, profile);
			});
		}));
};


module.exports = passportConfig;
// module.exports = (app) => {
// 	app.use(passport.initialize());
// 	app.use(passport.session());
//
//
// };