const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get('/logout', (req, res) => {
	req.logout();
	res.send({
		success: true,
		message: "You logged out",
	});
});

//Step 1: User goes to login page and is redirected to Azure AD
router.get('/login',
	passport.authenticate('azuread-openidconnect', { failureRedirect: '/login' }),
	(req, res) => {
		res.redirect('/');
	});

router.get('/openid/return',
	function (req, res, next) {
		passport.authenticate('azuread-openidconnect',
			{
				response: res,                      // required
				failureRedirect: '/error2',
				successRedirect: '/',
			}
		)(req, res, next);
	});

router.post('/openid/return',
	function (req, res, next) {
		passport.authenticate('azuread-openidconnect',
			{
				response: res,                      // required
				successRedirect: '/',
				failureRedirect: '/error1',
				failureFlash: true,
				// session: false,
			}
		)(req, res, next);
	});

module.exports = router;