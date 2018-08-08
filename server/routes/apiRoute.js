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

// function getUserRole(req,res,next) {
// 	console.log(req.cookie);
// 	return next();
// }

function ensureAuthenticated(req, res, next) {
	// console.log((req.method === 'GET' || req.xhr));
	if (req.isAuthenticated()) {
		return next();
	}else {
		res.status(401).send({
			error: "Authentication Error",
			message: "You must be signed in to view this resource!",
		});
	}
}

module.exports = router;
