const express = require("express");
const router = express.Router();

const courseRoute = require('./courseRoute');
const userRoute = require('./userRoute');
const subjectRoute = require('./subjectRoute');
const groupRoute = require('./groupRoute');

router.use(ensureAuthenticated);

router.use('/course', courseRoute);
router.use('/user', userRoute);
router.use('/subject', subjectRoute);
router.use('/group', groupRoute);

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated() && (req.method === 'GET' || req.xhr)) {
		return next();
	}
	res.status(401).send({
		error: "Authentication error",
		message: "You must be signed in to view this resource!",
	});
}

module.exports = router;
