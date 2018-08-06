var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

function handleError(error, res) {
	res.send({
		error: error.message,
	});
}

router.get("/list", function (req, res) {
	database.course.getCourses().then(courses => {
		res.send(courses);
	});
});

router.post("/", function (req, res) {
	database.course.getCourse(req.body).then(course => {
		res.send(course);
	}).catch(error => handleError(error, res));
});

module.exports = router;
