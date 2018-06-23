var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

router.get("/list", function (req, res, next) {
  database.subject.getSubjects().then(subjects => {
    res.send(subjects);
  });
});

module.exports = router;