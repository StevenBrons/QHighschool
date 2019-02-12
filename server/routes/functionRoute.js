var express = require("express");
var router = express.Router();
var functionDb = require('../database/FunctionDB');

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

module.exports = router;