var express = require("express");
var router = express.Router();
var course = require('../database/CourseDB');

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

router.get("/list", function (req, res) {
	course.getCourses().then(courses => {
		res.send(courses);
	});
});

router.post("/", function (req, res) {
	course.getCourse(req.body.courseId).then(course => {
		res.send(course);
	}).catch(error => handleError(error, res));
});

router.put("/", function (req, res) {
	if (req.user.isAdmin()) {
		course.addCourse(req.body).then(rows => {
			res.send(rows);
		}).catch(error => handleError(error, res));
	} else {
		authError(res);
	}
});

router.patch("/", function (req, res) {
	if (req.user.isTeacher()) {
		course.updateCourse(req.body).then(() => {
			res.send({
				success: true,
			});
		}).catch(error => handleError(error, res));
	} else {
		authError(res);
	}
});

module.exports = router;
