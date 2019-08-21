const express = require("express");
const router = express.Router();
const subjectDB = require('../database/SubjectDB');
const { promiseMiddleware, doReturn } = require('./handlers');
const { ensureSecure, ensureAdmin, } = require('./permissions');

router.get("/list", promiseMiddleware(() => {
	return subjectDB.getSubjects();
}), doReturn);

router.post("/", promiseMiddleware(({ body: { subjectId } }) => {
	return subjectDB.getSubject(subjectId);
}), doReturn);

router.put("/", ensureSecure, ensureAdmin, promiseMiddleware(({ body: { name, description } }) => {
	return subjectDB.addSubject(name, description);
}), doReturn);

module.exports = router;