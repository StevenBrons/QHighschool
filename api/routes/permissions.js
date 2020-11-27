const sessionDb = require('../database/SessionDB');
const keys = require("../private/keys");
const secureLogin = require('../lib/secureLogin');
const { getSubjectIdOfGroupId } = require('../database/GroupDB');
const { authError } = require("./handlers");

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

exports.ensureInSubjectGroup = async (req, res, next) => {
	const subjectId = await getSubjectIdOfGroupId(req.body.groupId);
	if (!req.user.inSubjectGroup(subjectId)) return authError(res);
	next();
}

exports.ensureStudent = (req, res, next) => {
	if (!req.user.isStudent()) return authError(res);
	next();
}

exports.ensureGradeAdmin = (req, res, next) => {
	if (!(req.user.isGradeAdmin())) return authError(res);
	next();
}

exports.ensureAdminOrGradeAdmin = (req, res, next) => {
	if (!(req.user.isGradeAdmin()) && !(req.user.isAdmin())) return authError(res);
	next();
}

exports.ensureConfirm = (req, res, next) => {
	if (req.body.message !== "confirm") {
		return new Error("You need to confirm this action");
	}
	next();
}

exports.public = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET");
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