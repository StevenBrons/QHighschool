const express = require("express");
const router = express.Router();
const course = require('../database/CourseDB');
const { handleSuccess, handleReturn, handleError } = require('./handlers');
const { ensureTeacher, ensureSecure, ensureAdmin } = require('./permissions');

router.get("/list", (req, res) => {
	course.getCourses()
		.then(handleReturn(res));
});

router.post("/", (req, res) => {
	course.getCourse(req.body.courseId)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.put("/", ensureSecure, ensureAdmin, (req, res) => {
	course.addCourse(req.body)
		.then(handleSuccess(res))
		.catch(handleError(res));
});

router.patch("/", ensureTeacher, (req, res) => {
	course.updateCourse(req.body)
		.then(handleSuccess(res))
		.catch(handleError(res));
});

module.exports = router;
