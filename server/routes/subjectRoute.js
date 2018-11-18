var express = require("express");
var router = express.Router();
var subjectDB = require('../database/SubjectDB');

function handleError(error, res) {
  res.send({
    error: error.message,
  });
}

router.get("/list", function (req, res, next) {
  subjectDB.getSubjects().then(subjects => {
    res.send(subjects);
  }).catch(error => handleError(error, res));
});

router.post("/", function (req, res, next) {
  subjectDB.getSubject(req.body.subjectId).then(subjects => {
    res.send(subjects);
  }).catch((err) => handleError(err, res));
});

module.exports = router;