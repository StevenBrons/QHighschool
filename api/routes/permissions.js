const sessionDb = require('../database/SessionDB');
const keys = require("../private/keys");
const secureLogin = require('../lib/secureLogin');
const { getSubjectIdOfGroupId } = require('../database/GroupDB');
const { authError, promiseMiddleware } = require("./handlers");
const userDb = require("../database/UserDB");

exports.ensureTeacher = (req, res, next) => {
	if (!req.user.isTeacher()) return next("a teacher");
	return next();
}

exports.ensureSecure = (req, res, next) => {
	if (!secureLogin.isValidToken(req, res)) return next("secure");
	return next();
}

exports.ensureAdmin = (req, res, next) => {
	if (!req.user.isAdmin()) return next("an admin");
	return next();
}

exports.ensureInGroup = (req, res, next) => {
	if (!req.user.inGroup(req.body.groupId)) return next("in the same group");
	return next();
}

exports.ensureInSubjectGroup = async (req, res, next) => {
	const subjectId = await getSubjectIdOfGroupId(req.body.groupId);
	if (!req.user.inSubjectGroup(subjectId)) return next("in the same subject group");
	return next();
}

exports.ensureStudent = (req, res, next) => {
	if (!req.user.isStudent()) return next("a student");
	return next();
}

exports.ensureGradeAdmin = (req, res, next) => {
	if (!req.user.isGradeAdmin()) return next("a grade admin");
	return next();
}

exports.ensureConfirm = (req, res, next) => {
	if (req.body.message !== "confirm") return next("have not confirmed");
	return next();
}

exports.publicAccess = (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET");
	return next();
}

exports.ensureOffice = (req, res, next) => {
	if (req.app.get('env') === 'development' && keys.develop === "develop") {
		return sessionDb.getUserByToken(keys.devLoginToken).then((serializedUser) => {
			req.user = serializedUser;
			return next();
		});
	}
	if (req.isAuthenticated()) {
		return next();
	}
	throw new Error("Authentication Error");
}

exports.ensureInSameGroup = async (req, res, next) => {
	const ownId = req.user.id;
	const otherId = req.body.userId;
	const g1 = await userDb.getParticipatingGroupIds(ownId, false);
	const g2 = await userDb.getParticipatingGroupIds(otherId, false);
	for (let i in g1) {
		if (g2.indexOf(g1[i]) !== -1) {
			return next();
		}
	}
	return next("in the same group!");
}

exports.ensureInSameSchool = async (req, res, next) => {
	const school = await userDb.getSchoolOfUser(req.body.userId);
	if (school !== req.user.school) return next("of the same school");
	return next();
}

exports.chain = (...funcs) => {
	return (req, res, next) => {
		let i = -1;
		function cont(err) {
			if (err) return next(err);
			i++;
			if (i < funcs.length) {
				funcs[i](req, res, cont);
			} else {
				return next();
			}
		}
		cont();
	}
}


exports.OR = (...chains) => {
	return (req, res, next) => {
		let terminatedErr = 0;
		let terminatedSuc = 0;
		function cont(err) {
			if (err) return handleErr(err);
			terminatedSuc += 1;
			if (terminatedSuc === 1) return next();
		}
		for (let i = 0; i < chains.length; i++) {
			try {
				exports.chain(...chains[i])(req, res, cont);
			} catch (err) {
				handleErr(err);
			}
		}
		function handleErr(err) {
			terminatedErr += 1;
			if (terminatedErr === chains.length) return next(err);
		}
	}

}