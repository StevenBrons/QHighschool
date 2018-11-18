const express = require("express");
const router = express.Router();

const courseRoute = require('./courseRoute');
const userRoute = require('./userRoute');
const subjectRoute = require('./subjectRoute');
const groupRoute = require('./groupRoute');
const functionRoute = require('./functionRoute');

router.use(ensureAuthenticated);
// router.use(handleErrors);

router.use('/course', courseRoute);
router.use('/user', userRoute);
router.use('/subject', subjectRoute);
router.use('/group', groupRoute);
router.use('/function', functionRoute);


// function handleErrors(req, res, next) {
// 	return next();
// }

function ensureAuthenticated(req, res, next) {
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
