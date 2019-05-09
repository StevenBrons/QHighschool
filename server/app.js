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

const formGenerator = require('./course_review/formGenerator');
formGenerator.generateFormForGroup({
	id: '49',
	courseId: 12,
	day: 'woensdag',
	period: 1,
	schoolYear: '2018/2019',
	enrollableFor: 'HAVO 4, VWO 4',
	courseName: 'Webdesign',
	courseDescription: 'Je leert hier een responsive website te ontwikkelen met opmaak van menu, tekst, plaatjes, filmpjes en lay-out van de website. Tevens leer je de basics van Javascript. Je leert ook om je website online te zetten.',
	remarks: '',
	studyTime: 24,
	subjectId: 8,
	subjectName: 'Informatica',
	subjectDescription: null,
	teacherId: 13,
	teacherName: 'Dort, Carlijn van',
	evaluation: null
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

app.use("/api", apiRoute);
app.use("/auth", authRoute);
app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
