const express = require("express");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");

router.secureLogins = [];
// const x = {
// 	userId: 1,
// 	validUntil: new Date(),
// 	token: require('uuid/v4')(),
// 	ip: "",
// }

router.get('/logout', (req, res) => {
	req.logout();
	res.send({
		success: true,
		message: "You logged out",
	});
});

router.get('/login', (req, res, next) => {
	if (req.query.secure === "true" && req.user != null && req.user.id != null) {
		for (let i = router.secureLogins.length - 1; i >= 0; i--) {
			if (router.secureLogins[i].validUntil.isBefore(moment())) {
				router.secureLogins.splice(i, 1);
				continue;
			}
			if (router.secureLogins[i].userId === req.user.id) {
				router.secureLogins.splice(i, 1);
				continue;
			}
		}
		router.secureLogins.push({
			userId: req.user.id,
			ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
			validUntil: moment().add(30, "minute"),
			token: require('uuid/v4')(),
			signed: false,
		});
	}
	next();
});

//Step 1: User goes to login page and is redirected to Azure AD
router.get('/login', passport.authenticate('azuread-openidconnect', {
	failureRedirect: '/login'
}), (req, res) => {
	res.redirect('/profiel?from=login');
});

function getSecureLogin(req) {
	if (req.user == null) {
		return "";
	}
	const secureLogin = router.secureLogins.filter((login) => {
		return login.userId === req.user.id &&
			login.validUntil.isAfter(moment()) &&
			login.signed === true &&
			login.ip === req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	})[0];
	if (secureLogin != null) {
		return "&secureLogin=" + secureLogin.token;
	} else {
		return "";
	}
}

router.get('/openid/return',
	function (req, res, next) {
		passport.authenticate('azuread-openidconnect', {
			response: res,                      // required
			failureRedirect: '/error2',
			successRedirect: '/profiel?from=login' + getSecureLogin(req),
		})(req, res, next);
	});

router.post('/openid/return',
	function (req, res, next) {
		passport.authenticate('azuread-openidconnect', {
			response: res,                      // required
			successRedirect: '/profiel?from=login' + getSecureLogin(req),
			failureRedirect: '/error1',
			failureFlash: false,
			// session: false,
		})(req, res, next);
	});

module.exports = router;