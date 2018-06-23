var express = require("express");
var router = express.Router();
var database = require('../database/mainDb');

router.get("/list", function (req, res, next) {
  database.subject.getSubjects().then(subjects => {
    res.send(subjects);
  });
});

module.exports = router;