const express = require("express");
const router = express.Router();
const keys = require("../private/keys");

const courseRoute = require('./courseRoute');
const userRoute = require('./userRoute');
const subjectRoute = require('./subjectRoute');
const groupRoute = require('./groupRoute');
const functionRoute = require('./functionRoute');
const certificateRoute = require('./certificateRoute');
const sessionDb = require('../database/SessionDB');

router.use(ensureAuthenticated);

router.use('/course', courseRoute);
router.use('/user', userRoute);
router.use('/subject', subjectRoute);
router.use('/group', groupRoute);
router.use('/function', functionRoute);
router.use('/certificate', certificateRoute);

function ensureAuthenticated(req, res, next) {
	if (req.app.get('env') === 'development' && keys.develop === "develop") {
		return sessionDb.getUserByToken(keys.devLoginToken).then((serializedUser) => {
			req.user = serializedUser;
			next();
		});
	}

	if (req.isAuthenticated()) {
		return next();
	} else {
		res.status(401).send({
			error: "Authentication Error",
			message: "You must be signed in to view this resource!",
		});
	}
}

module.exports = router;
