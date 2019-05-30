var express = require("express");
var router = express.Router();
var course = require('../database/CourseDB');
var secureLogin = require('../lib/secureLogin');

const handlers = require('./handlers');
const handleSuccess = handlers.handleSuccess;
const handleReturn = handlers.handleReturn;
const handleError = handlers.handleError;
const authError = handlers.authError;

router.get("/list", (req, res) => {
	course.getCourses()
		.then(handleReturn(res));
});

router.post("/", (req, res) => {
	course.getCourse(req.body.courseId)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.put("/", (req, res) => {
	if (!secureLogin.isValidToken(req, res)) return;
	if (req.user.isAdmin()) {
		course.addCourse(req.body)
			.then(handleSuccess(res))
			.catch(handleError(res));
	} else {
		authError(res);
	}
});

router.patch("/", (req, res) => {
	if (req.user.isTeacher()) {
		course.updateCourse(req.body)
			.then(handleSuccess(res))
			.catch(handleError(res));
	} else {
		authError(res);
	}
});

module.exports = router;
