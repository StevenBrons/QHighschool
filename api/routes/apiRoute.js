const express = require("express");
const router = express.Router();

const courseRoute = require('./courseRoute');
const userRoute = require('./userRoute');
const subjectRoute = require('./subjectRoute');
const groupRoute = require('./groupRoute');
const functionRoute = require('./functionRoute');
const certificateRoute = require('./certificateRoute');
const { ensureOffice } = require('./permissions');

router.use('/course', courseRoute);
router.use('/subject', subjectRoute);
router.use('/group', groupRoute);
router.use('/function', functionRoute);

router.use('/user', ensureOffice, userRoute);
router.use('/certificate', ensureOffice, certificateRoute);

module.exports = router;
