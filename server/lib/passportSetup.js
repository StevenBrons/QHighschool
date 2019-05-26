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

async function getUserDetails(accessToken) {
	const client = getAuthenticatedClient(accessToken);

	let x = await client.api("/me").get();

	console.log(x);

	const team = {
		"template@odata.bind": "https://graph.microsoft.com/beta/teamsTemplates('educationClass')",
		displayName: "Steven is awesome",
		description: "Jee!",
		"owners@odata.bind": [
			"https://graph.microsoft.com/beta/users('" + x.id + "')"
		]
	}

	// let res = await client.api("/teams")
	// 	.version("beta")
	// 	.post(team);
	// console.log(res);

	return user;
}

function getAuthenticatedClient(accessToken) {
	// Initialize Graph client
	const client = graph.Client.init({
		// Use the provided access token to authenticate
		// requests
		authProvider: (done) => {
			done(null, accessToken);
		}
	});

	return client;
}

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

