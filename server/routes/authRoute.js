const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get('/logout', (req, res) => {
	req.logOut();
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
				failureRedirect: '/error1'
			}
		)(req, res, next);
	},
	function (req, res) {
		res.redirect('/');
	});

router.post('/openid/return',
	function (req, res, next) {
		passport.authenticate('azuread-openidconnect',
			{
				response: res,                      // required
				failureRedirect: '/error'
			}
		)(req, res, next);
	},
	function (req, res) {
		res.redirect('/');
	});

module.exports = router;