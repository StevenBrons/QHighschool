var express = require("express");
var router = express.Router();
var mainDb = require('../database/mainDB');

function handleError(error, res) {
  res.send({
    error: error.message,
  });
}

router.post("/acceptEnrollemnts", function (req, res, next) {
  mainDb.function.addAllEnrollmentsToGroups();
});

module.exports = router;