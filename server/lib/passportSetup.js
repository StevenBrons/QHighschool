const passport = require("passport");
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const { azureADCreds } = require('../private/keys');
const sessionDb = require('../database/SessionDB');
const functionDb = require('../database/FunctionDB');
const secureLogin = require('./secureLogin');
const graphConnection = require("../office/graphConnection");

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
	if (email === "Qhighschool@quadraam.nl") {
		await graphConnection.initCreator(accessToken, refreshToken, params.expires_in);
		await graphConnection.test();
	}

	let user = await sessionDb.getUserByEmail(email).catch(done);
	if (user == null) {
		user = await functionDb.createUser(accessToken);
	}
	secureLogin.sign(user.id);
	if (user.graphId !== profile.oid) {
		await functionDb.updateGraphId(user.id, profile.oid);
	}

	done(null, { email });
}

