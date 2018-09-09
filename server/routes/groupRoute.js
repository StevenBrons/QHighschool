var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

function handleError(error, res) {
	res.status(406);
	res.send({
		error: error.message,
	});
}
function authError(res) {
	res.status(401);
	res.send({
		error: "Unauthorized",
	});
}

router.get("/list", function (req, res, next) {
	database.group.getGroups().then(groups => {
		res.send(groups);
	});
});

router.post("/", function (req, res, next) {
	database.group.getGroup(req.body.groupId).then(group => {
		res.send(group);
	}).catch(error => handleError(error, res))
});

router.put("/", function (req, res) {
	if (req.user.isAdmin()) {
		database.group.addGroup(req.body).then(rows => {
			res.send(rows);
		}).catch(error => handleError(error, res));
	}
});

router.post("/enrollments", function (req, res, next) {
	const groupId = req.body.groupId;
	if (req.user.isAdmin()) {
		database.group.getEnrollments(groupId).then(groups => {
			res.send(groups);
		}).catch((error) => handleError(error, res))
	}
});

router.post("/lessons", function (req, res, next) {
	database.group.getLessons(req.body.groupId).then(lessons => {
		res.send(lessons);
	}).catch((error) => handleError(error, res))
});

router.patch("/lessons", function (req, res, next) {
	let lessons = JSON.parse(req.body.lessons);
	//check if the user is allowed to edit every lesson object
	if (Array.isArray(lessons) && lessons.length >= 1) {
		let l = lessons.filter((l) => {
			return !req.user.inGroup(l.groupId);
		});
		if (req.user.isTeacher() && l.length === 0) {
			database.group.setLessons(lessons).then(() => {
				res.send({
					success: true,
				});
			}).catch((error) => handleError(error, res))
		} else {
			authError(res);
		}
	} else {
		throw new Error("Wrong datatypes");
	}
});

router.post("/participants", function (req, res, next) {
	if (req.user.inGroup(req.body.groupId)) {
		database.group.getParticipants(req.body.groupId).then(participants => {
			res.send(participants);
		}).catch((error) => handleError(error, res))
	} else {
		authError(res);
	}
});

router.patch("/participants", function (req, res, next) {
	if (req.user.isAdmin()) {
		database.function.addUserToGroup(req.body.userId, req.body.groupId).then(() => {
			res.send({
				success: true,
			});
		}).catch((error) => handleError(error, res))
	} else {
		authError(res);
	}
});

router.post("/presence", function (req, res, next) {
	if (req.user.isTeacher() && req.user.inGroup(req.body.groupId)) {
		database.group.getPresence(req.body.groupId).then(presence => {
			res.send(presence);
		}).catch((error) => handleError(error, res))
	} else {
		authError(res);
	}
});

router.patch("/presence", function (req, res, next) {
	if (!req.user.isTeacher() || !req.user.inGroup(req.body.groupId)) {
		authError(res);
	}
	let presenceObjs = JSON.parse(req.body.presence);
	let error = false;
	//check if the user is allowed to edit every presence object
	function setPresencesIfAllowed(oldPresences) {
		return Promise.all(presenceObjs.map((newPresence) => {
			if (error) {
				return {};
			}
			if (oldPresences.find(oldP => oldP.id === newPresence.id) != null) {
				return database.group.setPresence(newPresence);
			} else {
				error = true;
				authError(res);
			}
		}));
	}
	database.group.getPresence(req.body.groupId)
		.then(setPresencesIfAllowed);
	if (!error) {
		res.send({
			success: true,
		});
	}
});

router.post("/evaluations", function (req, res, next) {
	if (req.user.isTeacher()) {
		database.group.getEvaluations(req.body.groupId).then(evaluations => {
			res.send(evaluations);
		}).catch((error) => handleError(error, res))
	}
});

module.exports = router;
