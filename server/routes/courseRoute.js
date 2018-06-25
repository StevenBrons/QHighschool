var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

router.get("/list", function (req, res, next) {
  database.course.getCourses().then(courses => {
    res.send(courses);
  });
});

module.exports = router;
