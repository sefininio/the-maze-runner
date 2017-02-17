const config = require('./.dev/oauth');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new GoogleStrategy({
            clientID        : config.google.client_id,
            clientSecret    : config.google.client_secret,
            callbackURL     : config.google.redirect_uri,
        },
        (token, refreshToken, profile, done) => {
            process.nextTick(() => {
                console.log(profile.id);
                return done(null, profile);
            });
        }));
};