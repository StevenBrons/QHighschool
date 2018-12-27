var express = require("express");
var router = express.Router();
var mainDb = require('../database/MainDB');

// router.post("/acceptEnrollements", function (req, res, next) {
// 	if (req.user.isAdmin() && req.body.message === "confirm") {
// 		console.log("Accepting all current enrollments");
// 		mainDb.function.addAllEnrollmentsToGroups().then(() => {
// 			res.send({
// 				success: true,
// 			});
// 		});
// 	}
// });

router.post("/calculateLessonDates", function (req, res, next) {
	if (req.user.isAdmin() && req.body.message === "confirm") {
		console.log("Re-calculating all lesson dates");
		mainDb.function.updateALLLessonDates();
	}
});

module.exports = router;