const express = require("express");
const router = express.Router();
const groupDb = require('../database/GroupDB');
const courseDB = require('../database/CourseDB');
const functionDB = require('../database/FunctionDB');
const secureLogin = require('../lib/secureLogin');

const handlers = require('./handlers');
const handleSuccess = handlers.handleSuccess;
const handleReturn = handlers.handleReturn;
const handleError = handlers.handleError;
const authError = handlers.authError;

router.get("/list", function (req, res, next) {
	groupDb.getGroups(req.user.id)
		.then(handleReturn(res));
});

router.post("/", function (req, res, next) {
	groupDb.getGroup(req.body.groupId)
		.then(groupDb.appendEvaluation(req.user.id))
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.patch("/", function (req, res, next) {
	if (req.user.isAdmin()) {
		groupDb.setFullGroup(req.body)
			.then(handleReturn(res))
			.catch(handleError(res));
	} else {
		groupDb.setGroup(req.body)
			.then(handleReturn(res))
			.catch(handleError(res));
	}
});

router.put("/", function (req, res) {
	if (req.user.isAdmin()) {
		groupDb.addGroup(req.body)
			.then(handleSuccess(res))
			.catch(handleError(res));
	}
});

router.post("/enrollments", function (req, res, next) {
	if (req.user.isTeacher()) {
		groupDb.getEnrollments(req.body.groupId)
			.then(handleReturn(res))
			.catch(handleError(res))
	}
});

router.post("/lessons", function (req, res, next) {
	let userId = req.user.id;
	if (!req.user.inGroup(req.body.groupId)) {
		userId = null;
	}
	groupDb.getLessons(req.body.groupId, userId)
		.then(handleReturn(res))
		.catch(handleError(res))
});


async function patchLesson(req, lesson) {
	if (req.user.inGroup(lesson.courseGroupId)) {
		return groupDb.setLesson(lesson);
	}
}

router.patch("/lessons", function (req, res, next) {
	let lessons = JSON.parse(req.body.lessons);
	if (req.user.isTeacher() && Array.isArray(lessons) && lessons.length >= 1) {
		return Promise.all(lessons.map((lesson) => patchLesson(req, lesson)))
			.then(handleSuccess(res));
	} else {
		throw new Error("Wrong datatypes");
	}
});

router.post("/participants", function (req, res, next) {
	if (req.user.inGroup(req.body.groupId) && req.user.inGroup(req.body.groupId)) {
		groupDb.getParticipants(req.body.groupId, req.user.isTeacher())
			.then(handleReturn(res))
			.catch(handleError(res))
	} else {
		authError(res);
	}
});

router.patch("/participants", function (req, res, next) {
	if (req.user.isAdmin()) {
		functionDB.addUserToGroup(req.body.userId, req.body.groupId)
			.then(handleSuccess(res))
			.catch(handleError(res))
	} else {
		authError(res);
	}
});

router.patch("/userStatus", function (req, res, next) {
	groupDb.updateUserStatus(req.user.id, req.body.lessonId, req.body.userStatus)
		.then(handleSuccess(res))
		.catch(handleError(res))
});

router.post("/presence", ({ user, body }, res) => {
	if (!user.isTeacher() || !user.inGroup(body.groupId)) return authError(res);
	groupDb.getPresence(body.groupId)
		.then(handleReturn(res))
		.catch(handleError(res))
});

async function setPresence(newP, old) {
	if (old.find(o => (o.id === newP.id && o.userId === newP.userId)) != null) {
		return groupDb.setPresence(newP);
	}
	throw new Error("");
}

router.patch("/presence", async ({ user, body }, res, next) => {
	if (!user.isTeacher() || !user.inGroup(body.groupId)) return authError(res);
	const presenceObjs = JSON.parse(body.presence);
	const oldPs = await groupDb.getPresence(body.groupId);
	Promise.all(presenceObjs.map(newP => setPresence(newP, oldPs)))
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.post("/evaluations", function (req, res, next) {
	if (req.user.isTeacher() && req.user.inGroup(req.body.groupId)) {
		groupDb.getEvaluations(req.body.groupId)
			.then(handleReturn(res))
			.catch(handleError(res));
	} else {
		authError(res);
	}
});


async function setEvaluation(ev, req) {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let isInOneGroup = false;
	await courseDB.getGroupIdsOfCourse(ev.courseId).then(groupIds => groupIds.forEach(groupId => {
		if (req.user.inGroup(groupId)) {
			isInOneGroup = true;
		}
	}));
	if (isInOneGroup && Number.isInteger(ev.courseId) && ev.courseId >= 0) {
		return groupDb.setEvaluation({
			userId: ev.userId,
			assesment: ev.assesment,
			explanation: ev.explanation,
			type: ev.type,
			courseId: ev.courseId,
			updatedByIp: ip,
			updatedByUserId: req.user.id,
		});
	}
}

router.patch("/evaluations", (req, res) => {
	const evaluations = JSON.parse(req.body.evaluations);
	if (secureLogin.isValidToken(req.body.secureLogin, req.user.id, req.connection.remoteAddress) &&
		req.user.isTeacher() && Array.isArray(evaluations) && evaluations.length >= 1) {
		return Promise.all(evaluations.map((ev) => setEvaluation(ev, req)))
			.then(handleSuccess(res))
			.catch(handleError(res));
	} else {
		authError(res);
	}
});

module.exports = router;
