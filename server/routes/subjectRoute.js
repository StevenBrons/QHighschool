const express = require("express");
const router = express.Router();
const subjectDB = require('../database/SubjectDB');
const { handleReturn, handleError, } = require('./handlers');
const { ensureSecure, ensureAdmin, } = require('./permissions');

router.get("/list", (req, res) => {
	subjectDB.getSubjects()
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.post("/", (req, res) => {
	subjectDB.getSubject(req.body.subjectId)
		.then(handleReturn(res))
		.catch(handleError(res));
});

router.put("/", ensureSecure, ensureAdmin, (req, res) => {
	subjectDB.addSubject(req.body.name, req.body.description)
		.then(handleReturn(res))
		.catch(handleError(res));
});

module.exports = router;