const express = require("express");
const router = express.Router();
const userDb = require("../database/UserDB");
const groupDb = require("../database/GroupDB");
const { doReturn, doSuccess, promiseMiddleware, authError } = require("./handlers");
const { ensureAdmin, ensureStudent, ensureSecure, ensureAdminOrGradeAdmin } = require("./permissions");

router.get(
  "/self",
  promiseMiddleware(req => {
    return userDb.getSelf(req.user.id);
  }),
  doReturn
);

router.post(
  "/",
  promiseMiddleware(async (req, res) => {
    const role = req.user.role;
    if (role === "admin") return true;
    if (role === "grade_admin") {
      const school = await userDb.getSchoolOfUser(req.body.userId);
      if (school === req.user.school) {
        return true;
      }
    }
    if (role === "teacher") {
      const g1 = await userDb.getParticipatingGroupIds(req.user.id, false);
      const g2 = await userDb.getParticipatingGroupIds(req.body.userId, false);
      let shareGroup = false;
      for (let i in g1) {
        if (g2.indexOf(g1[i]) !== -1) {
          shareGroup = true;
        }
      }
      if (shareGroup) {
        return true;
      }
    }
    return new authError();
  }),
  promiseMiddleware(req => {
    return userDb.getUser(req.body.userId);
  }),
  doReturn
);

router.patch(
  "/",
  promiseMiddleware(req => {
    return userDb.setUser({ ...req.body, id: req.user.id });
  }),
  doSuccess
);

router.patch(
  "/full",
  ensureAdmin,
  ensureSecure,
  promiseMiddleware(req => {
    return userDb.setFullUser(req.body);
  }),
  doSuccess
);

router.put(
  "/enrollments",
  ensureStudent,
  promiseMiddleware(req => {
    return userDb.addUserEnrollment(req.user.id, req.body.groupId);
  }),
  doSuccess
);

router.delete(
  "/enrollments",
  ensureStudent,
  promiseMiddleware(req => {
    return userDb.removeUserEnrollment(req.user.id, req.body.groupId);
  }),
  doSuccess
);

router.get(
  "/enrollments",
  promiseMiddleware(req => {
    return userDb.getEnrollments(req.user.id);
  }),
  doReturn
);

router.get(
  "/enrollableGroups",
  promiseMiddleware(async req => {
    const groups = await groupDb.getGroups(req.user.id);
    var enrollableGroups = groups.filter(group => {
      return true;
    });
    return enrollableGroups;
  }),
  doReturn
);

router.get(
  "/groups",
  promiseMiddleware(req => {
    return userDb.getGroups(req.user.id, req.user.isAdmin());
  }),
  doReturn
);

router.get(
  "/list",
  ensureAdminOrGradeAdmin,
  promiseMiddleware(req => {
    if (req.user.isAdmin()) {
      return userDb.getList();
    } else {
      return userDb.getUsersOfSchool(req.user.school);
    }
  }),
  doReturn
);

module.exports = router;
