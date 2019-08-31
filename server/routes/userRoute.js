const express = require("express");
const router = express.Router();
const userDb = require('../database/UserDB');
const groupDb = require('../database/GroupDB');
const { doReturn, doSuccess, promiseMiddleware } = require('./handlers');
const { ensureAdmin, ensureStudent } = require('./permissions');

router.get("/self", promiseMiddleware((req) => {
	return userDb.getSelf(req.user.id);
}), doReturn);

router.post("/", ensureAdmin, promiseMiddleware((req) => {
	return userDb.getUser(req.body.userId);
}), doReturn);

router.patch("/", promiseMiddleware((req) => {
	return userDb.setUser({ ...req.body, userId: req.user.id });
}), doSuccess);

router.put("/enrollments", ensureStudent, promiseMiddleware((req) => {
	return userDb.addUserEnrollment(req.user.id, req.body.groupId);
}), doSuccess);

router.delete("/enrollments", ensureStudent, promiseMiddleware((req) => {
	return userDb.removeUserEnrollment(req.user.id, req.body.groupId);
}), doSuccess);

router.get("/enrollments", promiseMiddleware((req) => {
	return userDb.getEnrollments(req.user.id);
}), doReturn);

router.get("/enrollableGroups", promiseMiddleware(async (req) => {
	const groups = await groupDb.getGroups(req.user.id);
	var enrollableGroups = groups.filter((group) => {
		return (group.period === 1 && group.schoolYear === "2019/2020") || (group.subjectId === "Avonturen" && group.schoolYear === "2019/2020");
	});
	return enrollableGroups;
}), doReturn);

router.get("/groups", promiseMiddleware((req) => {
	return userDb.getGroups(req.user.id, req.user.isAdmin());
}), doReturn);

router.get("/list", ensureAdmin, promiseMiddleware(() => {
	return userDb.getList()
}), doReturn);

module.exports = router;
