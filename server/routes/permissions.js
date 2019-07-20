const sessionDb = require('../database/SessionDB');
const keys = require("../private/keys");
const secureLogin = require('../lib/secureLogin');

exports.ensureTeacher = (req, res, next) => {
	if (!req.user.isTeacher()) return authError(res);
	next();
}

exports.ensureSecure = (req, res, next) => {
	if (!secureLogin.isValidToken(req, res)) return;
	next();
}

exports.ensureAdmin = (req, res, next) => {
	if (!req.user.isAdmin()) return authError(res);
	next();
}

exports.ensureInGroup = (req, res, next) => {
	if (!req.user.inGroup(req.body.groupId)) return authError(res);
	next();
}

exports.ensureStudent = (req, res, next) => {
	if (!req.user.isStudent()) return authError(res);
	next();
}

exports.ensureOffice = (req, res, next) => {
	if (req.app.get('env') === 'development' && keys.develop === "develop") {
		return sessionDb.getUserByToken(keys.devLoginToken).then((serializedUser) => {
			req.user = serializedUser;
			next();
		});
	}
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.status(401).send({
			error: "Authentication Error",
			message: "You must be signed in to view this resource!",
		});
	}
}