var express = require("express");
var router = express.Router();

var user = {
    "key": "alksdjfjsl",
    "role": "student",
    "school": "Candea College",
    "firstname": "Steven",
    "lastname": "Brons",
    "year": 6,
    "level": "vwo",
    "preferedEmail": "steven@gmail.com"
}

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    res.send(user);
});

router.post("/", function (req, res, next) {
    user.preferedEmail = req.body.preferedEmail

    res.setHeader("Content-Type", "application/json");
    res.send(user);
});

module.exports = router;
