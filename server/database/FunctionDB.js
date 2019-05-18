const Enrollment = require("../dec/EnrollmentDec");
const Lesson = require("../dec/LessonDec");
const Presence = require("../dec/PresenceDec");
const Evaluation = require("../dec/EvaluationDec");
const Group = require("../dec/CourseGroupDec");
const LoggedIn = require("../dec/LoggedInDec");
const Course = require("../dec/CourseDec");
const Subject = require("../dec/SubjectDec");
const Participant = require("../dec/ParticipantDec");
const User = require("../dec/UserDec");
const Op = require('sequelize').Op;

class FunctionDB {

	init(groupDb) {
		this.groupDb = groupDb;
	}

	async createUser(profile) {

		let user = {
			email: profile.upn,
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			displayName: profile.displayName,
			school: null,
			role: "student",
			createIp: profile._json.ipaddr,
			preferedEmail: profile.upn,
		}

		if (/beekdallyceum\.nl$/g.test(user.email)) { user.school = "Beekdal" };
		if (/candea\.nl$/g.test(user.email)) { user.school = "Candea College" };
		if (/quadraam\.nl$/g.test(user.email)) { user.school = "Centraal Bureau" };
		if (/lyceumelst\.nl$/g.test(user.email)) { user.school = "Lyceum Elst" };
		if (/liemerscollege\.nl$/g.test(user.email)) { user.school = "Liemers College" };
		if (/lorentzlyceum\.nl$/g.test(user.email)) { user.school = "Lorentz Lyceum" };
		if (/maartenvanrossem\.nl$/g.test(user.email)) { user.school = "Maarten van Rossem" };
		if (/montessoriarnhem\.nl$/g.test(user.email)) { user.school = "Montessori College" };
		if (/olympuscollege\.nl$/g.test(user.email)) { user.school = "Olympus College" };
		if (/produsarnhem\.nl$/g.test(user.email)) { user.school = "Produs" };
		if (/gymnasiumarnhem\.nl$/g.test(user.email)) { user.school = "Stedelijk Gymnasium Arnhem" };
		if (/symbion-vo\.nl$/g.test(user.email)) { user.school = "Symbion" };
		if (/vmbo-venster\.nl$/g.test(user.email)) { user.school = "'t Venster" };
		if (/hetwesteraam\.nl$/g.test(user.email)) { user.school = "Het Westeraam" };

		if (user.school == null) {
			throw new Error("WRONG EMAIL");
		}

		if (
			!(/ll\.beekdallyceum\.nl$/g.test(user.email)) &&
			!(/ll\.candea\.nl$/g.test(user.email)) &&
			!(/ll\.quadraam\.nl$/g.test(user.email)) &&
			!(/ll\.lyceumelst\.nl$/g.test(user.email)) &&
			!(/ll\.liemerscollege\.nl$/g.test(user.email)) &&
			!(/ll\.lorentzlyceum\.nl$/g.test(user.email)) &&
			!(/ll\.maartenvanrossem\.nl$/g.test(user.email)) &&
			!(/ll\.montessoriarnhem\.nl$/g.test(user.email)) &&
			!(/ll\.olympuscollege\.nl$/g.test(user.email)) &&
			!(/ll\.produsarnhem\.nl$/g.test(user.email)) &&
			!(/ll\.gymnasiumarnhem\.nl$/g.test(user.email)) &&
			!(/ll\.symbion-vo\.nl$/g.test(user.email)) &&
			!(/ll\.vmbo-venster\.nl$/g.test(user.email)) &&
			!(/ll\.hetwesteraam\.nl$/g.test(user.email))
		) {
			user.role = "teacher";
		}

		return User.create(user);
	}

	async addAllEnrollmentsToGroups() {
		const enrollments = await Enrollment.findAll();
		const userAdds = enrollments.map((enrollment) => {
			if (enrollment.accepted === "false") {
				return this.addUserToGroup(enrollment.userId, enrollment.courseGroupId);
			}
		});
		await Promise.all(userAdds);
		await Promise.all(enrollments.map(e => e.update({
			accepted: "true",
		})));
		return true;
	}

	async addUserToGroup(userId, courseGroupId) {
		console.log("Adding " + userId + " to " + courseGroupId);
		await this._addParticipant(userId, courseGroupId);
		await this._addEvaluation(userId, courseGroupId);
		await this._addPresence(userId, courseGroupId);
	}

	async _addPresence(userId, courseGroupId) {
		return Lesson.findAll({ where: { courseGroupId } })
			.then(lessons => Promise.all(lessons.map(({ id }) => {
				return Presence.findOrCreate({
					where: {
						lessonId: id,
						userId,
					}, defaults: {
						lessonId: id,
						userId,
					}
				});
			})));
	}

	async _addEvaluation(userId, courseGroupId) {
		return Group.findByPk(courseGroupId, { attributes: ["courseId"] })
			.then(({ courseId }) => Evaluation.findOrCreate({
				where: {
					userId,
					courseId
				},
				defaults: {
					userId,
					courseId
				}
			}));
	}

	async _addParticipant(userId, courseGroupId) {
		return Participant.findOrCreate({
			where: {
				userId,
				courseGroupId,
			},
			defaults: {
				userId,
				courseGroupId,
			}
		});
	}

	async updateALLLessonDates() {
		return Group.findAll({ attributes: ["id", "period", "day"] })
			.then(rows => rows.map(({ id, period, day }) => {
				this.updateLessonDates(id, period, day);
			}));
	}

	async updateLessonDates(groupId, period, day) {
		const schedule = require("../lib/schedule");
		for (let i = 0; i < 9; i++) {
			const date = schedule.getLessonDate(period, i + 1, day);
			await Lesson.update({ date }, {
				where: {
					courseGroupId: groupId,
					numberInBlock: i + 1
				}
			});
		}
	}

	async addLessons(groupId, period, day) {
		const schedule = require("../lib/schedule");
		for (let i = 0; i < 9; i++) {
			await Lesson.create({
				courseGroupId: groupId,
				date: schedule.getLessonDate(period, i + 1, day),
				numberInBlock: i + 1,
			});
		}
	}

	async getEnrollment() {
		return Enrollment.findAll({
			include: [{
				model: Group,
				attributes: ["id"],
				include: [{
					model: Course,
					attributes: ["name"],
				}],
			}, {
				model: User,
				attributes: ["displayName", "school", "year", "level"],
			}]
		}).then(enrl => enrl.map(e => {
			return {
				dataValues: {
					...e.user.dataValues,
					courseName: e.course_group.course.name,
					courseGroupId: e.course_group.id,
					id: e.id,
					createdAt: e.createdAt,
				}
			}
		}));
	}

	async findEvaluation(userId, groupId) {
		const group = await this.groupDb.getGroup(groupId);
		const evaluation = await Evaluation.findOne({
			attributes: ["id", "userId", "type", "assesment", "explanation"],
			order: [["id", "DESC"]],
			raw: true,
			where: { userId, courseId: group.courseId },
			include: [{
				model: User,
				attributes: ["id", "email", "displayName"],
			}],
		});
		if (evaluation == null) {
			const user = await User.findOne({ where: { id: userId }, attributes: ["displayName", "email"] });
			return {
				type: "decimal",
				assesment: "",
				explanation: "",
				courseId: group.courseId,
				subject: group.subjectName,
				courseName: group.courseName,
				email: user.email,
				displayName: user.displayName,
				groupId: group.id,
			}
		}
		return {
			displayName: evaluation["user.displayName"],
			email: evaluation["user.email"],
			assesment: evaluation.assesment,
			type: evaluation.type,
			explanation: evaluation.explanation,
			courseName: group.courseName,
			subject: group.subjectName,
			groupId: group.id,
			courseId: group.courseId,
			userId,
		};
	}

	async getEvaluation(school) {
		const where = school ? { school: { [Op.or]: school.split("||"), } } : undefined;
		const pts = await Participant.findAll({
			attributes: ["userId", "courseGroupId"],
			order: [["courseGroupId", "DESC"]],
			where: { participatingRole: "student" },
			include: [{
				model: User,
				attributes: ["school"],
				where: where,
			}],
		});
		let evs = await Promise.all(pts.map(p => this.findEvaluation(p.userId, p.courseGroupId)));
		return [].concat(evs);
	}

	async getEnrollment(school) {
		const where = school ? { school: { [Op.or]: school.split("||"), } } : undefined;
		return Enrollment.findAll({
			raw: true,
			include: [{
				model: Group,
				attributes: ["id", "period"],
				include: [{
					model: Course,
					attributes: [["name", "courseName"]],
				}],
			}, {
				model: User,
				attributes: ["email", "displayName", "school", "year", "level"],
				where: where,
			}]
		}).then(enrl => enrl.map(e => {
			return {
				email: e["user.email"],
				courseName: e["course_group.course.courseName"],
				accepted: e["accepted"],
				groupId: e["courseGroupId"],
				courseId: e["course_group.id"],
				period: e["course_group.period"],
				displayName: e["user.displayName"],
				school: e["user.school"],
				year: e["user.year"],
				level: e["user.level"],
			}
		}));
	}

	async getUserData(school) {
		const where = school ? { school: { [Op.or]: school.split("||"), } } : undefined;
		return User.findAll({
			where: where,
			attributes: ["email", "role", "school", "displayName", "year", "level", "preferedEmail", "profile", "phoneNumber", "id"],
			raw: true,
		});
	}

	async setAlias(token, oldUserId, newUserId) {
		return LoggedIn.findOne({
			where: {
				token: token,
				active: true,
				userId: oldUserId,
			}
		}).then(login => {
			login.update({
				userId: newUserId,
			});
		});
	}

}



module.exports = new FunctionDB();

