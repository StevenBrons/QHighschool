const nodemailer = require("nodemailer");
const mailConfig = require("../private/keys").mailConfig
const path = require("path");
const fs = require("fs");
const ejs = require("ejs");
const userDb = require("../database/UserDB");
const groupDb = require("../database/GroupDB");
const courseDb = require("../database/CourseDB");

const enrollmentTemplate = fs.readFileSync(path.resolve(__dirname, "./templates/enrollment.ejs"), "utf8");
const derollmentTemplate = fs.readFileSync(path.resolve(__dirname, "./templates/derollment.ejs"), "utf8");
const evaluationChangeTemplate = fs.readFileSync(path.resolve(__dirname, "./templates/evaluationChange.ejs"), "utf8");
const evaluationChangeTeacherTemplate = fs.readFileSync(path.resolve(__dirname, "./templates/evaluationChangeTeacher.ejs"), "utf8");

let transporter = nodemailer.createTransport(mailConfig);

this.sendEnrollmentMail = async (userId, groupId) => {
	const user = await userDb.getSelf(userId);
	const group = await groupDb.getGroup(groupId);
	const mail = ejs.render(enrollmentTemplate, { group, user, }, {});
	transporter.sendMail({
		from: mailConfig.auth.user,
		to: user.preferedEmail,
		subject: `Bevestiging inschrijving ${group.courseName}`,
		html: mail,
	});
}
this.sendDerollmentMail = async (userId, groupId) => {
	const user = await userDb.getSelf(userId);
	const group = await groupDb.getGroup(groupId);
	const mail = ejs.render(derollmentTemplate, { group, user, }, {});
	transporter.sendMail({
		from: mailConfig.auth.user,
		to: user.preferedEmail,
		subject: `Bevestiging uitschrijving ${group.courseName}`,
		html: mail,
	});
}
this.sendEvaluationChangedMail = async (evaluation) => {
	const updatedByUser = (await userDb.getUser(evaluation.updatedByUserId)).displayName;
	const user = await userDb.getSelf(evaluation.userId);
	const course = await courseDb.getCourse(evaluation.courseId);
	const isCertificateWorthy = groupDb.isCertificateWorthy(evaluation);
	const mail = ejs.render(evaluationChangeTemplate, { user, evaluation, course, updatedByUser, isCertificateWorthy }, {});
	transporter.sendMail({
		from: mailConfig.auth.user,
		to: user.preferedEmail,
		subject: `Beoordeling gewijzigd voor ${course.name}`,
		html: mail,
	});
}

this.sendEvaluationChangedTeacherMail = async (evaluations, teacherId) => {
	const changedUsers = await Promise.all(evaluations.map(({ userId }) => userDb.getUser(userId)));
	const user = await userDb.getSelf(teacherId);
	const course = await courseDb.getCourse(evaluations[0].courseId);
	const mail = ejs.render(evaluationChangeTeacherTemplate, { changedUsers, user, course }, {});
	transporter.sendMail({
		from: mailConfig.auth.user,
		to: user.preferedEmail,
		subject: `Beoordeling gewijzigd voor ${course.name}`,
		html: mail,
	});
}