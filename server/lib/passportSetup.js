const passport = require("passport");
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const keys = require('../private/keys');
const creds = keys.azureADCreds;
const sessionDb = require('../database/SessionDB');
const functionDb = require('../database/FunctionDB');
const secureLogin = require('./secureLogin');
const graph = require("../office/graph");

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
	function (iss, sub, profile, accessToken, refreshToken, done) {
		const email = profile._json.preferred_username;
		if (email === "Qhighschool@quadraam.nl") {
			graph.initCreator(accessToken, refreshToken).catch(e => {
				console.error(e);
			});
		}

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

