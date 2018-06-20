var express = require("express");
var router = express.Router();
var Database = require('../database');

function toClientUser(databaseUser) {
    return {
        key: databaseUser.id,
        role: databaseUser.role,
        school: databaseUser.school,
        firstname: databaseUser.firstname,
        lastname: databaseUser.lastname,
        year: databaseUser.year,
        level: databaseUser.level,
        preferedEmail: databaseUser.preferedEmail
    }
}

function toClientChoice(databaseChoice) {
    if (databaseChoice !== null && databaseChoice !== undefined) {
        var choices = [];
        choices[0] = databaseChoice.firstchoice
        choices[1] = databaseChoice.secondchoice
        choices[2] = databaseChoice.thirdchoice
        return choices;
    } else {
        return [];
    }
}

function handleError(error, res) {
    res.setHeader("Content-Type", "application/json");
    res.send({
        error: error.message,
    });
}

var choices = [

]

router.get("/", (req, res) => {
    Database.getUser(req.headers.userid).then((user) => {
        res.setHeader("Content-Type", "application/json");
        res.send(toClientUser(user));
    }).catch(error => {
        handleError(error, res);
    });
});

router.post("/", (req, res) => {
    user.preferedEmail = req.body.preferedEmail
    res.setHeader("Content-Type", "application/json");
    res.send(user);
});

router.post("/choices", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    choices = (req.body.choices).split(",");
    res.send(choices);
});

router.get("/choices", (req, res) => {
    Database.getChoice(req.headers.userid).then(choice => {
        res.setHeader("Content-Type", "application/json");
        res.send(toClientChoice(choice));
    }).catch((error) => {
        handleError(error, res);
    });
});

module.exports = router;
