var express = require("express");
var router = express.Router();
var course = require('../database/CourseDB');

const handlers = require('./handlers');
const handleSuccess = handlers.handleSuccess;
const handleReturn = handlers.handleReturn;
const handleError = handlers.handleError;
const authError = handlers.authError;

router.get("/list", function (req, res) {
	course.getCourses()
		.then(handleReturn(res));
});

router.post("/", function (req, res) {
	course.getCourse(req.body.courseId)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.put("/", function (req, res) {
	if (req.user.isAdmin()) {
		course.addCourse(req.body)
			.then(handleSuccess(res))
			.catch(handleError(res));
	} else {
		authError(res);
	}
});

router.patch("/", function (req, res) {
	if (req.user.isTeacher()) {
		course.updateCourse(req.body)
			.then(handleSuccess(res))
			.catch(handleError(res));
	} else {
		authError(res);
	}
});

module.exports = router;
