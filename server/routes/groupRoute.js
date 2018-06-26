var express = require("express");
var router = express.Router();
var database = require('../database/MainDB');

function handleError(error, res) {
  res.send({
    error: error.message,
  });
}

router.get("/list", function (req, res, next) {
  database.group.getGroups().then(groups => {
    res.send(groups);
  });
});

router.post("/", function (req, res, next) {
  database.group.getGroup(req.body).then(group => {
    res.send(group);
  }).catch(error => handleError(error, res))
});

module.exports = router;
