const express = require("express");
const router = express.Router();
const groupDb = require('../database/GroupDB');
const courseDB = require('../database/CourseDB');
const { authError, doReturn, promiseMiddleware, doSuccess } = require('./handlers');
const { ensureOffice, ensureTeacher, ensureSecure, ensureAdmin, ensureInGroup, ensureInSubjectGroup } = require('./permissions');

router.get("/list", ensureOffice, promiseMiddleware((req) => {
	return groupDb.getGroups(req.user.id);
}), doReturn);

router.post("/", promiseMiddleware(async (req) => {
	const group = await groupDb.getGroup(req.body.groupId);
	return groupDb.appendEvaluation(group, req.user.id);
}), doReturn);

router.patch("/", ensureOffice, ensureTeacher, ensureInGroup, promiseMiddleware((req) => {
	if (req.user.isAdmin()) {
		return groupDb.setFullGroup(req.body)
	} else {
		return groupDb.setGroup(req.body)
	}
}), doReturn);

router.put("/", ensureOffice, ensureSecure, ensureAdmin, promiseMiddleware((req) => {
	return groupDb.addGroup(req.body)
}), doSuccess);

router.post("/enrollments", ensureOffice, ensureTeacher, ensureInSubjectGroup, promiseMiddleware((req) => {
	if (req.user.isGradeAdmin()) {
		return groupDb.getEnrollments(req.body.groupId, req.user.school);
	} else {
		return groupDb.getEnrollments(req.body.groupId);
	}
}), doReturn);

router.post("/lessons", ensureOffice, promiseMiddleware((req, res) => {
	let userId = req.user.id;
	if (!req.user.inGroup(req.body.groupId)) {
		userId = null;
	}
	return groupDb.getLessons(req.body.groupId, userId)
}), doReturn);


async function patchLesson(req, lesson) {
	if (req.user.inGroup(lesson.courseGroupId)) {
		return groupDb.setLesson(lesson);
	}
}

router.patch("/lessons", ensureOffice, ensureTeacher, promiseMiddleware((req) => {
	let lessons = JSON.parse(req.body.lessons);
	if (Array.isArray(lessons) && lessons.length >= 1) {
		return Promise.all(lessons.map((lesson) => patchLesson(req, lesson)));
	} else {
		throw new Error("Wrong datatypes");
	}
}), doSuccess);

router.post("/participants", ensureOffice, promiseMiddleware(async (req, res) => {
	const groupId = req.body.groupId;
	const subjectId = await groupDb.getSubjectIdOfGroupId(groupId);
	if ((req.user.isStudent() && req.user.inGroup(groupId)) ||
		(req.user.isTeacher() && req.user.inSubjectGroup(subjectId))) {
		if (req.user.isGradeAdmin()) {
			return groupDb.getParticipants(req.body.groupId, req.user.isTeacher(), req.user.school);
		} else {
			return groupDb.getParticipants(req.body.groupId, req.user.isTeacher());
		}
	} else {
		authError(res);
	}
}), doReturn);

router.patch("/participants", ensureOffice, ensureAdmin, promiseMiddleware((req) => {
	return groupDb.addUserToGroup(req.body.userId, req.body.groupId, req.body.participatingRole);
}), doSuccess);

router.patch("/userStatus", ensureOffice, promiseMiddleware((req) => {
	return groupDb.updateUserStatus(req.user.id, req.body.lessonId, req.body.userStatus);
}), doSuccess);

router.post("/presence", ensureOffice, ensureInGroup, ensureTeacher, promiseMiddleware((req) => {
	if (req.user.isGradeAdmin()) {
		return groupDb.getPresence(req.body.groupId, req.user.school);
	} else {
		return groupDb.getPresence(req.body.groupId);
	}
}), doReturn);

router.patch("/presence", ensureOffice, ensureTeacher, ensureInGroup, promiseMiddleware(async ({ body }) => {
	const presenceObjs = JSON.parse(body.presence);
	return Promise.all(presenceObjs.map(p => groupDb.setPresence(p, body.groupId)));
}), doSuccess);

router.post("/evaluations", ensureOffice, ensureTeacher, ensureInGroup, promiseMiddleware((req) => {
	if (req.user.isGradeAdmin()) {
		return groupDb.getEvaluations(req.body.groupId, req.user.school);
	} else {
		return groupDb.getEvaluations(req.body.groupId);
	}
}), doReturn);

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

router.patch("/evaluations", ensureOffice, ensureSecure, ensureTeacher, promiseMiddleware((req, res) => {
	const evaluations = JSON.parse(req.body.evaluations);
	if (Array.isArray(evaluations) && evaluations.length >= 1) {
		return Promise.all(evaluations.map((ev) => setEvaluation(ev, req)))
	} else {
		authError(res);
	}
}), doSuccess);

module.exports = router;
