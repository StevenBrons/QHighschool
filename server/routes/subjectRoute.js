var express = require("express");
var router = express.Router();
var subjectDB = require('../database/SubjectDB');

const handlers = require('./handlers');
const handleReturn = handlers.handleReturn;
const handleError = handlers.handleError;

router.get("/list", function (req, res) {
	subjectDB.getSubjects()
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.post("/", function (req, res) {
	subjectDB.getSubject(req.body.subjectId)
		.then(handleReturn(res))
		.catch(handleError(res));
});

module.exports = router;