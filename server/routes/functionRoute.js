var express = require("express");
var router = express.Router();
var mainDb = require('../database/mainDB');

function handleError(error, res) {
	res.send({
		error: error.message,
	});
}

router.post("/acceptEnrollements", function (req, res, next) {
	if (req.user.isAdmin() && req.body.message === "confirm") {
		console.log("Accepting all current enrollments");
		mainDb.function.addAllEnrollmentsToGroups().then(() => {
			res.send({
				success: true,
			});
		});
	}
});

module.exports = router;