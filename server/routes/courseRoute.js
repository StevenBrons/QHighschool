const express = require("express");
const router = express.Router();
const course = require('../database/CourseDB');
const { promiseMiddleware, doReturn, doSuccess } = require('./handlers');
const { ensureOffice, ensureTeacher, ensureSecure, ensureAdmin, ensureInGroup } = require('./permissions');

router.get("/list", promiseMiddleware(async () => {
	return course.getCourses();
}), doReturn);

router.put("/", ensureOffice, ensureSecure, ensureAdmin, promiseMiddleware(async (req) => {
	return course.addCourse(req.body);
}), doSuccess);

router.patch("/", ensureOffice, ensureTeacher, ensureInGroup, promiseMiddleware(async (req) => {
	return course.updateCourse(req.body)
}), doSuccess);

module.exports = router;
