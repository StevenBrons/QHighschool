var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

function handleError(error, res) {
  res.send({
    error: error.message,
  });
}

router.get("/list", function (req, res, next) {
  database.course.getCourses().then(courses => {
    res.send(courses);
  });
});

router.get("/", function (req, res, next) {
  database.course.getCourse(req.body).then(courses => {
    res.send(courses);
  }).catch(error => handleError(error, res))
});

module.exports = router;
