const express = require("express");
const router = express.Router();
const groupDb = require('../database/GroupDB');
const courseDB = require('../database/CourseDB');
const { handleSuccess, handleReturn, handleError, authError } = require('./handlers');
const { ensureTeacher, ensureSecure, ensureAdmin, ensureInGroup } = require('./permissions');

router.get("/list", (req, res) => {
	groupDb.getGroups(req.user.id)
		.then(handleReturn(res));
});

router.post("/", (req, res) => {
	groupDb.getGroup(req.body.groupId)
		.then(group => groupDb.appendEvaluation(group, req.user.id))
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.patch("/", ensureTeacher, (req, res) => {
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

router.put("/", ensureSecure, ensureAdmin, (req, res) => {
	groupDb.addGroup(req.body)
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.post("/enrollments", ensureTeacher, (req, res) => {
	groupDb.getEnrollments(req.body.groupId)
		.then(handleReturn(res))
		.catch(handleError(res))
});

router.post("/lessons", (req, res) => {
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

router.patch("/lessons", ensureTeacher, (req, res) => {
	let lessons = JSON.parse(req.body.lessons);
	if (Array.isArray(lessons) && lessons.length >= 1) {
		return Promise.all(lessons.map((lesson) => patchLesson(req, lesson)))
			.then(handleSuccess(res));
	} else {
		throw new Error("Wrong datatypes");
	}
});

router.post("/participants", ensureInGroup, (req, res) => {
	groupDb.getParticipants(req.body.groupId, req.user.isTeacher())
		.then(handleReturn(res))
		.catch(handleError(res))
});

router.patch("/participants", ensureAdmin, (req, res) => {
	groupDb.addUserToGroup(req.body.userId, req.body.groupId, req.body.participatingRole)
		.then(handleSuccess(res))
		.catch(handleError(res))
});

router.patch("/userStatus", (req, res) => {
	groupDb.updateUserStatus(req.user.id, req.body.lessonId, req.body.userStatus)
		.then(handleSuccess(res))
		.catch(handleError(res))
});

router.post("/presence", ensureInGroup, ensureTeacher, (req, res) => {
	groupDb.getPresence(req.body.groupId)
		.then(handleReturn(res))
		.catch(handleError(res))
});

router.patch("/presence", ensureTeacher, ensureInGroup, async ({ body }, res) => {
	const presenceObjs = JSON.parse(body.presence);
	Promise.all(presenceObjs.map(p => groupDb.setPresence(p, body.groupId)))
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.post("/evaluations", ensureTeacher, ensureInGroup, (req, res) => {
	groupDb.getEvaluations(req.body.groupId)
		.then(handleReturn(res))
		.catch(handleError(res));
});

async function setEvaluation(ev, req) {
	const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	let isInOneGroup = false;
	await courseDB.getGroupIdsOfCourseId(ev.courseId).then(groupIds => groupIds.forEach(groupId => {
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

router.patch("/evaluations", ensureSecure, ensureTeacher, (req, res) => {
	const evaluations = JSON.parse(req.body.evaluations);
	if (Array.isArray(evaluations) && evaluations.length >= 1) {
		return Promise.all(evaluations.map((ev) => setEvaluation(ev, req)))
			.then(handleSuccess(res))
			.catch(handleError(res));
	} else {
		authError(res);
	}
});

module.exports = router;
