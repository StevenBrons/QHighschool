var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

function handleError(error, res) {
  res.send({
    error: error.message,
  });
}

router.get("/list", function (req, res, next) {
  database.subject.getSubjects().then(subjects => {
    res.send(subjects);
  }).catch(error => handleError(error,res));
});

router.post("/", function (req, res, next) {
  database.subject.getSubject(req.body.subjectId).then(subjects => {
    res.send(subjects);
  }).catch((err) => handleError(err,res));
});

module.exports = router;