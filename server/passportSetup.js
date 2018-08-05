const passport = require("passport");
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const creds = require('./private/keys').azureADCreds;
// const UserDB = require("./UserDB");

passport.serializeUser(function (user, done) {
	//Step 7: Passport uses part of user profile to generate identifier

	done(null, user.oid);
});

passport.deserializeUser(function (oid, done) {
	//return an user profile from identifier
	let err = null;

	done(err, {
		name: "test",
	});
});

passport.use(new OIDCStrategy({
	callbackURL: creds.returnURL,
	realm: creds.realm,
	clientID: creds.clientID,
	clientSecret: creds.clientSecret,
	oidcIssuer: creds.issuer,
	identityMetadata: creds.identityMetadata,
	skipUserProfile: creds.skipUserProfile,
	responseType: creds.responseType,
	responseMode: creds.responseMode,
	allowHttpForRedirectUrl: creds.allowHttpForRedirectUrl,
	redirectUrl: creds.returnURL,
}, (iss, sub, profile, accessToken, refreshToken, done) => {
	//Step 5: Passport sends profile data to callback
	console.log(profile);
	if (!profile.oid) {
		return done(new Error("No oid found"), null);
	}
	return done(null, profile);
}));

