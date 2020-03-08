var express = require("express");
var router = express.Router();
var functionDb = require("../database/FunctionDB");
var taxi = require("../lib/taxi");
const { promiseMiddleware, doSuccess, doReturn } = require("./handlers");
const { disableSecureMode } = require("../lib/secureLogin");
const {
  ensureAdmin,
  ensureConfirm,
  ensureSecure,
  ensureGradeAdmin
} = require("./permissions");

router.post(
  "/updateAllGroups",
  ensureAdmin,
  ensureConfirm,
  promiseMiddleware(() => {
    console.log("Updating all groups!");
    return functionDb.updateAllGroups();
  }),
  doSuccess
);

router.post(
  "/taxi",
  promiseMiddleware(req => {
    if (req.user.isAdmin()) {
      return taxi.getSchedule(-1, parseInt(req.body.week));
    } else {
      return taxi.getSchedule(req.user.id, parseInt(req.body.week));
    }
  }),
  doReturn
);

router.post(
  "/alias",
  ensureAdmin,
  ensureSecure,
  promiseMiddleware((req, res) => {
    if (Number.isInteger(req.user.id) && req.user.id >= 0) {
      return functionDb.setAlias(req.user.token, req.user.id, req.body.userId);
    } else {
      throw new Error("Invalid data types");
    }
  }),
  doSuccess
);

router.post(
  "/disableSecureMode",
  ensureAdmin,
  ensureSecure,
  ensureConfirm,
  (req, res, next) => {
    disableSecureMode();
    next();
  },
  doSuccess
);

async function formatInTable(modelName, array) {
  const keys = Object.keys(array[0]);
  return [keys, ...array.map(obj => keys.map(key => obj[key]))];
}

router.post(
  "/data",
  ensureSecure,
  ensureGradeAdmin,
  promiseMiddleware((req, res) => {
    const table = req.body.table;
    const school = req.user.school;
    switch (table) {
      case "evaluations":
        return functionDb.getEvaluation(school).then(x => formatInTable("Evaluation", x));
      case "enrollments":
        return functionDb.getEnrollment(school).then(x => formatInTable("Enrollment", x));
      case "users":
        return functionDb.getUserData(school).then(x => formatInTable("User", x));
      case "courseIds":
        return functionDb.getCourseIdsData().then(x => formatInTable("Course", x));
      default:
        throw new Error("invalid table: " + table);
    }
  }),
  doReturn
);

module.exports = router;
