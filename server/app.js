const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cookieSession = require('cookie-session');
const passport = require("passport");

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const apiRoute = require('./routes/apiRoute');
const authRoute = require('./routes/authRoute');
const keys = require('./private/keys');
const bodyParser = require('body-parser');
var flash = require('connect-flash');

require('./dec/MainDec');
require('./dec/UserDec');
require('./dec/CourseDec');
require('./dec/SubjectDec');
require('./dec/CourseGroupDec');
require('./dec/EnrollmentDec');
require('./dec/EvaluationDec');
require('./dec/LessonDec');
require('./dec/PresenceDec');
require('./dec/NotificationDec');
require('./dec/LoggedInDec');

require('./lib/passportSetup');
require('./lib/taxi');
require('./office/graphConnection');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
	keys: [keys.sessionSecret],
	maxAge: 7 * 24 * 60 * 60 * 1000,
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRoute);
app.use("/auth", authRoute);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/public", express.static(path.join(__dirname, "public")))
app.use("/profiel", (req, res) => {
	res.redirect('http://localhost:3000/profiel/?from=login&secureLogin=' + req.query.secureLogin);
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
