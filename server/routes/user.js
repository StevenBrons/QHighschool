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

var choices = [

]

router.get("/", function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    res.send(user);
});

router.post("/", function (req, res, next) {
    user.preferedEmail = req.body.preferedEmail

    res.setHeader("Content-Type", "application/json");
    res.send(user);
});

router.post("/choices", function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    choices = (req.body.choices).split(",");
    res.send(choices);
});

router.get("/choices", function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    res.send(choices);
});

module.exports = router;
