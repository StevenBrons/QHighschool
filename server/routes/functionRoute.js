var express = require("express");
var router = express.Router();
var functionDb = require('../database/FunctionDB');
const handlers = require('./handlers');
const handleReturn = handlers.handleReturn;

// router.post("/acceptEnrollements", function (req, res, next) {
// 	if (req.user.isAdmin() && req.body.message === "confirm") {
// 		console.log("Accepting all current enrollments");
// 		functionDb.addAllEnrollmentsToGroups().then(() => {
// 			res.send({
// 				success: true,
// 			});
// 		});
// 	}
// });

router.post("/calculateLessonDates", function (req, res, next) {
	if (req.user.isAdmin() && req.body.message === "confirm") {
		console.log("Re-calculating all lesson dates");
		functionDb.updateALLLessonDates();
	}
});

async function formatInTable(array) {
	const keys = Object.keys(array[0].dataValues);
	return [keys, ...array.map(obj => keys.map(key => obj.dataValues[key]))];
}

router.post("/data", function (req, res, next) {
	const table = req.body.table; //evaluation,user_data,enrollment
	const school = req.user.school;
	if (req.user.isAdmin() || (req.user.isGradeAdmin() && req.user.school != null)) {
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
	}

});

module.exports = router;