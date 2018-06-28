var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

function handleError(error, res) {
	res.send({
		error: error.message,
	});
}

router.get("/", (req, res) => {
	database.user.getUser(req.headers.token).then((user) => {
		res.send(user);
	}).catch(error => handleError(error, res));
});

router.post("/", (req, res) => {
	database.user.setUser(req.headers.token, req.body).then((data) => {
		res.send({
			success: true,
		});
	}).catch(error => handleError(error, res));
});

router.put("/enrollments", (req, res) => {
	database.user.addUserEnrollment(req.headers.token, req.body.groupId).then((data) => {
		res.send({
			success: true,
		});
	}).catch(error => handleError(error, res));
});

router.delete("/enrollments", (req, res) => {
	database.user.removeUserEnrollment(req.headers.token, req.body.groupId).then((data) => {
		res.send({
			success: true,
		});
	}).catch(error => handleError(error, res));
});

router.get("/enrollments", (req, res) => {
	database.user.getEnrollments(req.headers.token).then(enrollments => res.send(enrollments)).catch(error => handleError(error, res));
});

router.get("/enrollableGroups", function (req, res, next) {
	const token = req.headers.token;
	database.group.getGroups().then(groups => {
		var enrollableGroups = groups.filter((group) => { return group.period == 1 });
		res.send(enrollableGroups);
	});
});

module.exports = router;
