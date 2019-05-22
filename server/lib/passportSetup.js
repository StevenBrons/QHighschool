const passport = require("passport");
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const keys = require('../private/keys');
const creds = keys.azureADCreds;
const sessionDb = require('../database/SessionDB');
const functionDb = require('../database/FunctionDB');
const secureLogin = require('./secureLogin');
// const graph = require("../office/graph");
const graph = require('@microsoft/microsoft-graph-client');


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

    const user = await client.api('/me').get();
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

passport.use(new OIDCStrategy({
	identityMetadata: creds.identityMetadata,
	clientID: creds.clientID,
	responseType: creds.responseType,
	responseMode: creds.responseMode,
	redirectUrl: creds.returnURL,
	allowHttpForRedirectUrl: creds.allowHttpForRedirectUrl,
	clientSecret: creds.clientSecret,
	// validateIssuer: creds.validateIssuer,
	// 	isB2C: creds.isB2C,
	// 	issuer: creds.issuer,
	// 	passReqToCallback: creds.passReqToCallback,
	// 	scope: creds.scope,
	// 	loggingLevel: creds.loggingLevel,
	// 	nonceLifetime: creds.nonceLifetime,
	// 	nonceMaxAmount: creds.nonceMaxAmount,
	// 	useCookieInsteadOfSession: creds.useCookieInsteadOfSession,
	cookieEncryptionKeys: creds.cookieEncryptionKeys,
	validateIssuer: true,
	passReqToCallback: false,
	scope: creds.scope,
},
	function (iss, sub, profile, accessToken, refreshToken, params, done) {
		console.log("iero")
		const email = profile.upn;
		console.log(email);
		const x = getUserDetails(accessToken).then(x => {
			console.log(x);
		}).catch(e => {
			console.error(e);
		});

		// if (email === "Qhighschool@quadraam.nl") {
		// 	console.log("heer")
		// 	graph.initCreator(accessToken, refreshToken).catch(e => {
		// 		console.error(e);
		// 	});
		// }

		sessionDb.getUserByEmail(email).then((user) => {
			if (user == null) {
				functionDb.createUser(accessToken).then((u) => {
					done(null, { email });
				});
			} else {
				secureLogin.sign(user.id);
				done(null, { email });
			}
		}).catch((err) => {
			done(err);
		});
	}
));

