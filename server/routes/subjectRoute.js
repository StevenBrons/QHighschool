const express = require("express");
const router = express.Router();
const subjectDB = require('../database/SubjectDB');
const secureLogin = require('../lib/secureLogin');

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

router.put("/", function (req, res) {
	if (!secureLogin.isValidToken(req, res)) return;
	subjectDB.addSubject(req.body.name, req.body.description)
		.then(handleReturn(res))
		.catch(handleError(res));
});

module.exports = router;