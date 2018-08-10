var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

function handleError(error, res) {
	res.send({
		error: error.message,
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

router.post("/participants", function (req, res, next) {
	if (req.user.role === "teacher") {
		database.group.getParticipants(req.body.groupId).then(participants => {
			res.send(participants);
		}).catch((error) => handleError(error, res))
	}
});

module.exports = router;
