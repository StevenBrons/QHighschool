var express = require("express");
var router = express.Router();

var courses = [{
  "key": "0",
  "name": "Informatica",
  "subject": null,
  "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
  "teacher": null,
  "period": 1,
  "schoolyear": "2018/2019",
}, {
  "key": "1",
  "name": "Filosofie",
  "subject": null,
  "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
  "teacher": null,
  "period": 1,
  "schoolyear": "2018/2019",
}, {
  "key": "2",
  "subject": null,
  "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
  "name": "Spaans",
  "teacher": null,
  "period": 1,
  "schoolyear": "2018/2019",
}, {
  "key": "3",
  "name": "Tekenen",
  "subject": null,
  "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
  "teacher": null,
  "period": 1,
  "schoolyear": "2018/2019",
}, {
  "key": "4",
  "name": "Spaans per2",
  "subject": null,
  "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. ",
  "teacher": null,
  "period": 2,
  "schoolyear": "2018/2019",
}];

/* GET users listing. */
router.get("/list", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.send(courses);
});

router.get("/choices", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");

  var choices = courses.filter((course) => { return course.period == 1 });
  res.send(choices);
});

module.exports = router;
