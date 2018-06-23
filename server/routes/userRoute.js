var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

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
	Database.setUser(req.headers.userid, req.body).then((data) => {
		res.send({
			success: true,
		});
	});
});

router.post("/choices", (req, res) => {
	let choices = (req.body.choices).split(",");
	Database.setUserChoices(req.headers.userid, choices).then((data) => {
		res.send({
			success: true,
		});
	}).catch((error) => {
		handleError(error, res);
	});
});

router.get("/choices", (req, res) => {
	database.user.getChoices(req.headers.userid).then(choices => {
		res.send(choices);
	}).catch((error) => {
		handleError(error, res);
	});
});

module.exports = router;
