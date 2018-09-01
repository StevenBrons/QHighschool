const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const expressSession = require('express-session');
const passport = require("passport");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const apiRoute = require('./routes/apiRoute');
const authRoute = require('./routes/authRoute');
const keys = require('./private/keys');
const bodyParser = require('body-parser')
const database = require('./database/MainDB');

require('./passportSetup');

const app = express();

// setTimeout(() => {
// 	database.group.addGroup({
// 		courseId:1,
// 		day: "maandag",
// 		teacherId: 1,
// 		period: 2,
// 		schoolYear: "2018/2019",
// 	}).catch(err => {
// 		console.log(err);
// 	});
// }, 1000);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
	keys: [keys.sessionSecret],
	maxAge: 7 * 24 * 60 * 60 * 1000,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');//a webadres
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'token');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

app.use("/api", apiRoute);
app.use("/auth", authRoute);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/error", (req, res, next) => {
	res.send("error");
});

app.use(function (req, res, next) {
	next(createError(404));
});

app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
