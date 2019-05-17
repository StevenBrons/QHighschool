const express = require("express");
const router = express.Router();
const passport = require("passport");
const secureLogin = require("../lib/secureLogin");
const sessionDb = require("../database/SessionDB");

router.get('/logout', async (req, res) => {
	await sessionDb.destroySession(req.user.email);
	req.logout();
	res.send({
		success: true,
		message: "You logged out",
	});
});

router.get("/success", (req, res, next) => {
	res.redirect("/profiel?from=login" + secureLogin.getToken(req));
});

router.get('/login', (req, res, next) => {
	if (req.query.secure === "true" && req.user != null && req.user.id != null) {
		secureLogin.removeByUserId(req.user.id);
		secureLogin.add(req.user.id);
	}
	next();
});

//Step 1: User goes to login page and is redirected to Azure AD
router.get('/login', passport.authenticate('azuread-openidconnect', {
	failureRedirect: '/login'
}), (req, res) => {
	res.redirect('/auth/success');
});

router.get('/openid/return',
	function (req, res, next) {
		passport.authenticate('azuread-openidconnect', {
			response: res,                      // required
			failureRedirect: '/error2',
			successRedirect: '/auth/success',
		})(req, res, next);
	});

router.post('/openid/return',
	function (req, res, next) {
		passport.authenticate('azuread-openidconnect', {
			response: res,                      // required
			successRedirect: '/auth/success',
			failureRedirect: '/error1',
			failureFlash: false,
			// session: false,
		})(req, res, next);
	});

module.exports = router;