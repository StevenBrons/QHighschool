const express = require("express");
const router = express.Router();
const database = require('../database/MainDB');
const groupDb = require('../database/GroupDB');

const handlers = require('./handlers');
const handleSuccess = handlers.handleSuccess;
const handleReturn = handlers.handleReturn;
const handleError = handlers.handleError;

router.get("/self", (req, res) => {
	database.user.getSelf(req.user.id)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.post("/", (req, res) => {
	database.user.getUser(req.body.userId)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.patch("/", (req, res) => {
	database.user.setUser({ ...req.body, userId: req.user.id })
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.put("/enrollments", (req, res) => {
	if (req.user.isStudent()) {
		database.user.addUserEnrollment(req.user.id, req.body.groupId)
			.then(handleSuccess(res))
			.catch(handleError(res));
	} else {
		authError(res);
	}
});

router.delete("/enrollments", (req, res) => {
	if (req.user.isStudent()) {
		database.user.removeUserEnrollment(req.user.id, req.body.groupId)
			.then(handleSuccess(res))
			.catch(handleError(res));
	}
});

router.get("/enrollments", (req, res) => {
	database.user.getEnrollments(req.user.id)
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.get("/enrollableGroups", function (req, res, next) {
	groupDb.getGroups().then(groups => {
		var enrollableGroups = groups.filter((group) => {
			return group.period == 1
		});
		return enrollableGroups;
	}).then(handleReturn(res));
});

router.get("/groups", (req, res) => {
	database.user.getGroups(req.user.id, req.user.isAdmin())
		.then(handleReturn(res));
});

module.exports = router;
