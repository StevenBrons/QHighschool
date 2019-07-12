const express = require("express");
const router = express.Router();
const userDb = require('../database/UserDB');
const groupDb = require('../database/GroupDB');

const handlers = require('./handlers');
const handleSuccess = handlers.handleSuccess;
const handleReturn = handlers.handleReturn;
const handleError = handlers.handleError;

router.get("/self", (req, res) => {
	userDb.getSelf(req.user.id)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.post("/", (req, res) => {
	if (req.user.isAdmin()) {
		userDb.getUser(req.body.userId)
			.then(handleReturn(res))
			.catch(handleError(res));
	}
});

router.patch("/", (req, res) => {
	userDb.setUser({ ...req.body, userId: req.user.id })
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.put("/enrollments", (req, res) => {
	if (req.user.isStudent()) {
		userDb.addUserEnrollment(req.user.id, req.body.groupId)
			.then(handleSuccess(res))
			.catch(handleError(res));
	} else {
		authError(res);
	}
});

router.delete("/enrollments", (req, res) => {
	if (req.user.isStudent()) {
		userDb.removeUserEnrollment(req.user.id, req.body.groupId)
			.then(handleSuccess(res))
			.catch(handleError(res));
	}
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

router.get("/list", (req, res) => {
	if (req.user.isAdmin()) {
		userDb.getList()
			.then(handleReturn(res));
	}
});

module.exports = router;
