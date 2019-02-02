const passport = require("passport");
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const keys = require('../private/keys');
const creds = keys.azureADCreds;
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

passport.use(new OIDCStrategy({
	identityMetadata: creds.identityMetadata,
	clientID: creds.clientID,
	responseType: creds.responseType,
	responseMode: creds.responseMode,
	redirectUrl: creds.redirectUrl,
	allowHttpForRedirectUrl: creds.allowHttpForRedirectUrl,
	clientSecret: creds.clientSecret,
	validateIssuer: creds.validateIssuer,
	isB2C: creds.isB2C,
	issuer: creds.issuer,
	passReqToCallback: creds.passReqToCallback,
	scope: creds.scope,
	loggingLevel: creds.loggingLevel,
	nonceLifetime: creds.nonceLifetime,
	nonceMaxAmount: creds.nonceMaxAmount,
	useCookieInsteadOfSession: creds.useCookieInsteadOfSession,
	cookieEncryptionKeys: creds.cookieEncryptionKeys,
	clockSkew: creds.clockSkew,
	redirectUrl: creds.returnURL,
},
	function (iss, sub, profile, accessToken, refreshToken, done) {
		sessionDb.getUserByEmail(profile.upn).then((user) => {
			if (user == null) {
				functionDb.createUser(profile).then((u) => {
					done(null, profile);
				});
			} else {
				secureLogin.sign(user.id);
				done(null, profile);
			}
		}).catch((err) => {
			done(err);
		});
	}
));
