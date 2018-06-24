var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

router.get("/list", function (req, res, next) {
  database.course.getCourses().then(courses => {
    res.send(courses);
  });
});

router.get("/choices", function (req, res, next) {
  database.course.getCourses().then(courses => {
    var choices = courses.filter((course) => { return course.period == 1 });
    res.send(choices);
  });
});

module.exports = router;
