const passport = require("passport");
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const creds = require('./private/keys').azureADCreds;
const database = require('./database/MainDB');

passport.serializeUser((user, done) => {
	//Step 7: Passport uses part of user profile to generate identifier

	//TODO: generate a token to use for serialization
	console.log(user);

	done(null, user.email);
});

passport.deserializeUser((oid, done) => {
	//return an user profile from identifier
	let err = null;

	done(err, {
		name: "test",
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
		database.session.getUserByEmail(profile.upn).then((user) => {
			if (user == null) {
				database.session.createUser(profile).then((user) => {
					done(null, user);
				});
			} else {
				done(user);
			}
		});
	}
));

