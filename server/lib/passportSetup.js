const passport = require("passport");
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const keys = require('../private/keys');
const creds = keys.azureADCreds;
const sessionDb = require('../database/SessionDB');
const functionDb = require('../database/FunctionDB');
const secureLogin = require('./secureLogin');
const syncSetup = require("../office/syncSetup");

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
	// 	identityMetadata: creds.identityMetadata,
	// 	clientID: creds.clientID,
	// 	responseType: creds.responseType,
	// 	responseMode: creds.responseMode,
	// 	redirectUrl: creds.redirectUrl,
	// 	allowHttpForRedirectUrl: creds.allowHttpForRedirectUrl,
	// 	clientSecret: creds.clientSecret,
	// 	validateIssuer: creds.validateIssuer,
	// 	isB2C: creds.isB2C,
	// 	issuer: creds.issuer,
	// 	passReqToCallback: creds.passReqToCallback,
	// 	scope: creds.scope,
	// 	loggingLevel: creds.loggingLevel,
	// 	nonceLifetime: creds.nonceLifetime,
	// 	nonceMaxAmount: creds.nonceMaxAmount,
	// 	useCookieInsteadOfSession: creds.useCookieInsteadOfSession,
	// 	cookieEncryptionKeys: creds.cookieEncryptionKeys,
	// 	clockSkew: creds.clockSkew,
	// 	redirectUrl: creds.returnURL,
	// }
	// identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
	identityMetadata: creds.identityMetadata,
	clientID: process.env.OAUTH_APP_ID,
	responseType: 'code id_token',
	responseMode: 'form_post',
	redirectUrl: process.env.OAUTH_REDIRECT_URI,
	allowHttpForRedirectUrl: true,
	clientSecret: process.env.OAUTH_APP_PASSWORD,
	validateIssuer: true,
	passReqToCallback: false,
	scope: process.env.OAUTH_SCOPES.split(' ')
},
	function (iss, sub, profile, accessToken, refreshToken, done) {
		if (profile.upn === "Qhighschool@quadraam.nl") {
			syncSetup.init(accessToken, refreshToken).catch(e => {
				console.error(e);
			});
		}

		const email = profile._json.preferred_username;

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

