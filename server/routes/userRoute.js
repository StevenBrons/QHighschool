var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

function handleError(error, res) {
	res.send({
		error: error.message,
	});
}

router.get("/", (req, res) => {
	database.user.getUser(req.headers.userId).then((user) => {
		res.send(user);
	}).catch(error => {
		handleError(error, res);
	});
});

router.post("/", (req, res) => {
	database.user.setUser(req.headers.userId, req.body).then((data) => {
		res.send({
			success: true,
		});
	}).catch(error => {
		handleError(error,res);
	});
});

router.post("/choices/add", (req, res) => {
	database.user.addUserChoice(req.headers.userId, req.body.courseId).then((data) => {
		res.send({
			success: true,
		});
	}).catch((error) => {
		handleError(error, res);
	});
});

router.post("/choices/remove", (req, res) => {
	database.user.removeUserChoice(req.headers.userId, req.body.courseId).then((data) => {
		res.send({
			success: true,
		});
	}).catch((error) => {
		handleError(error, res);
	});
});

router.get("/choices/list", (req, res) => {
	database.user.getChoices(req.headers.userId).then(choices => {
		res.send(choices);
	}).catch((error) => {
		handleError(error, res);
	});
});

module.exports = router;
