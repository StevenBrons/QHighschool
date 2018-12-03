const express = require("express");
const router = express.Router();
const database = require('../database/MainDB');
const groupDb = require('../database/GroupDB');

function handleError(error, res) {
	res.status(406);
	res.send({
		error: error.message,
	});
}
function authError(res) {
	res.status(401);
	res.send({
		error: "Unauthorized",
	});
}
router.get("/self", (req, res) => {
	database.user.getSelf(req.user.id).then((user) => {
		res.send(user);
	}).catch(error => handleError(error, res));
});

router.post("/", (req, res) => {
	database.user.getUser(req.body.userId).then((user) => {
		res.send(user);
	}).catch(error => handleError(error, res));
});

router.patch("/", (req, res) => {
	database.user.setUser(req.user.id, req.body).then((data) => {
		res.send({
			success: true,
		});
	}).catch(error => handleError(error, res));
});

router.put("/enrollments", (req, res) => {
	if (req.user.isStudent()) {
		database.user.addUserEnrollment(req.user.id, req.body.groupId).then((data) => {
			res.send({
				success: true,
			});
		}).catch(error => handleError(error, res));
	} else {
		authError(res);
	}
});

router.delete("/enrollments", (req, res) => {
	if (req.user.isStudent()) {
		database.user.removeUserEnrollment(req.user.id, req.body.groupId).then(() => {
			res.send({
				success: true,
			});
		}).catch(error => handleError(error, res));
	}
});

router.get("/enrollments", (req, res) => {
	database.user.getEnrollments(req.user.id)
		.then(enrollments => res.send(enrollments))
		.catch(error => handleError(error, res));
});

router.get("/enrollableGroups", function (req, res, next) {
	groupDb.getGroups().then(groups => {
		var enrollableGroups = groups.filter((group) => {
			return group.period == 1
		});
		res.send(enrollableGroups);
	});
});

router.get("/groups", (req, res) => {
	database.user.getGroups(req.user.id, req.user.isAdmin()).then(groups => {
		res.send(groups);
	});
});

module.exports = router;
