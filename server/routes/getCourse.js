var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/courses", function (req, res, next) {

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
  }];

  res.setHeader("Content-Type", "application/json");
  res.send(courses);
});

module.exports = router;
