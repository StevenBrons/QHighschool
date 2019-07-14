const passport = require("passport");
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const { azureADCreds } = require('../private/keys');
const sessionDb = require('../database/SessionDB');
const functionDb = require('../database/FunctionDB');
const secureLogin = require('./secureLogin');

passport.serializeUser((profile, done) => {
	sessionDb.createTokenForUser(profile).then((token) => {
		done(null, token);
	}).catch((err) => {
		console.log(err);
		done(err);
	});
});

passport.deserializeUser((token, done) => {
	sessionDb.getUserByToken(token).then((user) => {
		done(null, user);
	}).catch((err) => {
		console.log(err);
		done(err);
	});
});

passport.use(new OIDCStrategy(azureADCreds, passportCallback));

async function passportCallback(req, iss, sub, profile, accessToken, refreshToken, params, done) {
	const email = profile._json.preferred_username;
	let user = await sessionDb.getUserByEmail(email).catch(done);
	if (user == null) {
		user = await functionDb.createUser(accessToken);
	}
	secureLogin.sign(user.id);
	done(null, { email });
}

