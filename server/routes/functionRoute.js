var express = require("express");
var router = express.Router();
var functionDb = require('../database/FunctionDB');
var taxi = require('../lib/taxi');
const handlers = require('./handlers');
const secureLogin = require('../lib/secureLogin');
const handleReturn = handlers.handleReturn;
const handleError = handlers.handleError;
const authError = handlers.authError;
const handleSuccess = handlers.handleSuccess;

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
	if (!secureLogin.isValidToken(req, res)) return;
	if (req.user.isAdmin()) {
		if (Number.isInteger(req.user.id) && req.user.id >= 0) {
			functionDb.setAlias(req.user.token, req.user.id, req.body.userId)
				.then(handleSuccess(res));
		}
	} else {
		authError(res);
	}
});

async function formatInTable(array) {
	const keys = Object.keys(array[0]);
	return [keys, ...array.map(obj => keys.map(key => obj[key]))]
}

router.post("/data", function (req, res, next) {
	if (!secureLogin.isValidToken(req, res)) return;
	const table = req.body.table; //evaluation,user_data,enrollment
	const school = req.user.school;
	if ((req.user.isAdmin() || (req.user.isGradeAdmin() && req.user.school != null))) {
		switch (table) {
			case "evaluations":
				functionDb.getEvaluation(school)
					.then(formatInTable)
					.then(handleReturn(res));
				break;
			case "enrollments":
				functionDb.getEnrollment(school)
					.then(formatInTable)
					.then(handleReturn(res));
				break;
			case "users":
				functionDb.getUserData(school)
					.then(formatInTable)
					.then(handleReturn(res));
				break;
			default:
				handleError(res)({
					message: "invalid table: " + table,
				});
		}
	} else {
		handlers.authError(res);
	}
});

module.exports = router;