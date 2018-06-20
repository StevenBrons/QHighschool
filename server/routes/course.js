var express = require("express");
var router = express.Router();
var Database = require('../database');


function toClientCourse(databaseCourse) {
  return {
    key: databaseCourse.id,
    subject: null,
    name: databaseCourse.name,
    description: databaseCourse.description,
    teacher: null,
    period: databaseCourse.period,
    schoolyear: databaseCourse.schoolyear,
  }
}

/* GET users listing. */
router.get("/list", function (req, res, next) {
  Database.getCourses().then(courses => {
    res.send(courses.map(toClientCourse));
  });
});

router.get("/choices", function (req, res, next) {
  Database.getCourses().then(courses => {
    var choices = courses.filter((course) => { return course.period == 1 });
    res.send(choices.map(toClientCourse));
  });
});

module.exports = router;
