var express = require("express");
var router = express.Router();
var database = require('../database/mainDb');

function handleError(error, res) {
	res.send({
		error: error.message,
	});
}

router.get("/", (req, res) => {
	database.user.getUser(req.headers.userid).then((user) => {
		res.send(user);
	}).catch(error => {
		handleError(error, res);
	});
});

router.post("/", (req, res) => {
	database.user.setUser(req.headers.userid, req.body).then((data) => {
		res.send({
			success: true,
		});
	}).catch(error => {
		handleError(error,res);
	});
});

router.post("/choices/add", (req, res) => {
	database.user.addUserChoice(req.headers.userid, req.body.courseId).then((data) => {
		res.send({
			success: true,
		});
	}).catch((error) => {
		handleError(error, res);
	});
});

router.post("/choices/remove", (req, res) => {
	database.user.removeUserChoice(req.headers.userid, req.body.courseId).then((data) => {
		res.send({
			success: true,
		});
	}).catch((error) => {
		handleError(error, res);
	});
});

router.get("/choices/list", (req, res) => {
	database.user.getChoices(req.headers.userid).then(choices => {
		res.send(choices);
	}).catch((error) => {
		handleError(error, res);
	});
});

module.exports = router;
