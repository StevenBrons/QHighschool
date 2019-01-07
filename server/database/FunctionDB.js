const Enrollment = require("../databaseDeclearations/EnrollmentDec");
const Lesson = require("../databaseDeclearations/LessonDec");
const Presence = require("../databaseDeclearations/PresenceDec");
const Evaluation = require("../databaseDeclearations/EvaluationDec");
const Group = require("../databaseDeclearations/CourseGroupDec");
const Participant = require("../databaseDeclearations/ParticipantDec");
const User = require("../databaseDeclearations/UserDec");

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
		await Enrollment.findAll().then((rows) => {
			rows.map((enrollment) => {
				if (enrollment.accepted === "false") {
					this.addUserToGroup(enrollment.userId, enrollment.groupId);
				}
			});
		});
		return true;
	}

	async addUserToGroup(userId, groupId) {
		await this._addParticipant(userId, groupId);
		await this._addEvaluation(userId, groupId);
		await this._addPresence(userId, groupId);
	}

	async _addPresence(userId, groupId) {
		return Lesson.findOne({ where: { groupId } })
			.then(lessons => Prommise.all(lessons.map(({ id }) => {
				return Presence.create({
					lessonId: id,
					userId,
				});
			})));
	}

	async _addEvaluation(userId, groupId) {
		return Group.findByPrimary(groupId, { attributes: courseId })
			.then((courseId) => Evaluation.create({
				userId,
				courseId
			}));
	}

	async _addParticipant(userId, groupId) {
		return Participant.create({
			userId,
			courseGroupId: groupId,
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

}



module.exports = new FunctionDB();

