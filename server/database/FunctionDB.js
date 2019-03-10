const Enrollment = require("../dec/EnrollmentDec");
const Lesson = require("../dec/LessonDec");
const Presence = require("../dec/PresenceDec");
const Evaluation = require("../dec/EvaluationDec");
const Group = require("../dec/CourseGroupDec");
const LoggedIn = require("../dec/LoggedInDec");
const Course = require("../dec/CourseDec");
const Participant = require("../dec/ParticipantDec");
const User = require("../dec/UserDec");
const Op = require('sequelize').Op;

class FunctionDB {

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
		for (let i = 0; i < 8; i++) {
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
		for (let i = 0; i < 8; i++) {
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

	async _findEvaluation(userId, groupId) {
		return Evaluation.findOne({
			attributes: ["id", "type", "assesment", "explanation", "userId", "updatedAt"],
			order: [["id", "DESC"]],
			where: { userId },
			include: [{
				raw: true,
				model: Course,
				attributes: ["id", "name"],
				include: {
					model: Group,
					attributes: ["id"],
					where: {
						id: groupId,
					}
				},
			}, {
				raw: true,
				model: User,
				attributes: ["displayName"],
			}]
		}).then(ev => {
			if (ev == null) {
				return {
					dataValues: {
						"id": -Math.floor(Math.random() * 1000),
						"type": "",
						"assesment": "",
						"explanation": "",
						"userId": userId,
						"groupId": groupId,
						"updatedAt": "",
					}
				}
			}
			let out = {
				dataValues: {
					...ev.dataValues,
					courseName: ev.course.name,
					groupId: groupId,
					displayName: ev.user.displayName,
				}
			};
			delete out.dataValues.course;
			delete out.dataValues.user;
			return out;
		});
	}

	async getEvaluation(school) {
		const where = school ? { school: { [Op.or]: school.split("||"), } } : undefined;
		return Participant.findAll({
			attributes: ["userId", "courseGroupId"],
			order: [["courseGroupId", "DESC"]],
			include: [{
				model: User,
				attributes: ["school"],
				where: where,
			}],
		}).then(evs => {
			return Promise.all(evs.map(e => this._findEvaluation(e.userId, e.courseGroupId)));
		});
	}

	async getEnrollment(school) {
		const where = school ? { school: { [Op.or]: school.split("||"), } } : undefined;
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
				where: where,
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

	async getUserData(school) {
		const where = school ? { school: { [Op.or]: school.split("||"), } } : undefined;
		return User.findAll({
			where: where,
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

