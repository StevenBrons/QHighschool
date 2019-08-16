const express = require("express");
const router = express.Router();
const userDb = require('../database/UserDB');
const groupDb = require('../database/GroupDB');
const { handleSuccess, handleReturn, handleError } = require('./handlers');
const { ensureTeacher, ensureSecure, ensureAdmin, ensureStudent } = require('./permissions');

router.get("/self", (req, res) => {
	userDb.getSelf(req.user.id)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.post("/", ensureAdmin, (req, res) => {
	userDb.getUser(req.body.userId)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.patch("/", (req, res) => {
	userDb.setUser({ ...req.body, userId: req.user.id })
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.put("/enrollments", ensureStudent, (req, res) => {
	userDb.addUserEnrollment(req.user.id, req.body.groupId)
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.delete("/enrollments", ensureStudent, (req, res) => {
	userDb.removeUserEnrollment(req.user.id, req.body.groupId)
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.get("/enrollments", (req, res) => {
	userDb.getEnrollments(req.user.id)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.get("/enrollableGroups", async (req, res) => {
	const groups = await groupDb.getGroups(req.user.id);
	var enrollableGroups = groups.filter((group) => {
		return group.period === 1 && group.schoolYear === "2019/2020";
	});
	handleReturn(res)(enrollableGroups);
});

router.get("/groups", (req, res) => {
	userDb.getGroups(req.user.id, req.user.isAdmin())
		.then(handleReturn(res));
});

router.get("/list", ensureAdmin, (req, res) => {
	userDb.getList()
		.then(handleReturn(res));
});

module.exports = router;
