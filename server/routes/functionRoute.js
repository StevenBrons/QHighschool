var express = require("express");
var router = express.Router();
var functionDb = require('../database/FunctionDB');
var taxi = require('../lib/taxi');
const handlers = require('./handlers');
const secureLogin = require('../lib/secureLogin');
const handleReturn = handlers.handleReturn;
const handleSuccess = handlers.handleSuccess;

router.post("/acceptEnrollements", function (req, res, next) {
	if (req.user.isAdmin() && req.body.message === "confirm") {
		console.log("Accepting all current enrollments");
		functionDb.addAllEnrollmentsToGroups().then(() => {
			res.send({
				success: true,
			});
		});
	}
});

router.post("/calculateLessonDates", function (req, res, next) {
	if (req.user.isAdmin() && req.body.message === "confirm") {
		console.log("Re-calculating all lesson dates");
		functionDb.updateALLLessonDates();
	}
});

router.post("/calculateLessonDates", function (req, res, next) {
	if (req.user.isAdmin() && req.body.message === "confirm") {
		console.log("Re-calculating all lesson dates");
		functionDb.updateALLLessonDates();
	}
});

router.post("/taxi", function (req, res, next) {
	if (req.user.isAdmin()) {
		taxi.getSchedule(-1, parseInt(req.body.week))
			.then(handleReturn(res));
	} else {
		taxi.getSchedule(req.user.id, parseInt(req.body.week))
			.then(handleReturn(res));
	}
});

router.post("/alias", function (req, res, next) {
	if (req.user.isAdmin() && secureLogin.isValidToken(req.body.secureLogin, req.user.id, req.connection.remoteAddress)) {
		if (Number.isInteger(req.user.id) && req.user.id >= 0) {
			functionDb.setAlias(req.user.token, req.user.id, req.body.userId)
				.then(handleSuccess(res));
		}
	}
});

async function formatInTable(array) {
	const keys = Object.keys(array[0].dataValues);
	return [keys, ...array.map(obj => keys.map(key => obj.dataValues[key]))];
}

router.post("/data", function (req, res, next) {
	const table = req.body.table; //evaluation,user_data,enrollment
	const school = req.user.school;
	if ((req.user.isAdmin() || (req.user.isGradeAdmin() && req.user.school != null))
		&& secureLogin.isValidToken(req.body.secureLogin, req.user.id, req.connection.remoteAddress)) {
		switch (table) {
			case "evaluation":
				functionDb.getEvaluation(school)
					.then(formatInTable)
					.then(handleReturn(res));
				break;
			case "enrollment":
				functionDb.getEnrollment(school)
					.then(formatInTable)
					.then(handleReturn(res));
				break;
			case "user_data":
				functionDb.getUserData(school)
					.then(formatInTable)
					.then(handleReturn(res));
				break;
		}
	} else {
		handlers.authError(res);
	}
});

module.exports = router;