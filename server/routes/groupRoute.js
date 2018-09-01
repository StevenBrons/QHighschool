var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

function handleError(error, res) {
	res.send({
		error: error.message,
	});
}
function authError(res) {
	res.send({
		error: "Unauthorized",
	});
}

router.get("/list", function (req, res, next) {
	database.group.getGroups().then(groups => {
		res.send(groups);
	});
});

router.post("/", function (req, res, next) {
	database.group.getGroup(req.body.groupId).then(group => {
		res.send(group);
	}).catch(error => handleError(error, res))
});

router.put("/", function (req, res) {
	if (req.user.role === "admin") {
		database.group.addGroup(req.body).then(rows => {
			res.send(rows);
		}).catch(error => handleError(error, res));
	}
});

router.post("/enrollments", function (req, res, next) {
	if (req.user.role === "teacher") {
		database.group.getEnrollments(req.body.groupId).then(groups => {
			res.send(groups);
		}).catch((error) => handleError(error, res))
	}
});

router.post("/lessons", function (req, res, next) {
	database.group.getLessons(req.body.groupId).then(lessons => {
		res.send(lessons);
	}).catch((error) => handleError(error, res))
});

router.patch("/lessons", function (req, res, next) {
	if (req.user.role === "teacher") {
		database.group.setLessons(req.body.lessons).then(() => {
			res.send({
				success: true,
			});
		}).catch((error) => handleError(error, res))
	}else {
		authError(res);
	}
});

router.post("/participants", function (req, res, next) {
	if (req.user.role === "teacher") {
		database.group.getParticipants(req.body.groupId).then(participants => {
			res.send(participants);
		}).catch((error) => handleError(error, res))
	}
});

router.post("/presence", function (req, res, next) {
	if (req.user.role === "teacher") {
		database.group.getPresence(req.body.groupId).then(presence => {
			res.send(presence);
		}).catch((error) => handleError(error, res))
	}
});

router.post("/evaluations", function (req, res, next) {
	if (req.user.role === "teacher") {
		database.group.getEvaluations(req.body.groupId).then(evaluations => {
			res.send(evaluations);
		}).catch((error) => handleError(error, res))
	}
});

module.exports = router;
