const Enrollment = require("../databaseDeclearations/EnrollmentDec");

class FunctionDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async query(sqlString, value) {
		return this.mainDb.connection.query(sqlString, value);
	}

	async createUser(profile) {

		let user = {
			email: profile.upn,
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			displayName: profile.displayName,
			school: null,
			role: "student",
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

		return this.query(
			"INSERT INTO user_data " +
			"(email,role,firstName,lastName,displayName,school,createIp) VALUES" +
			"(?,?,?,?,?,?,?)",
			[user.email, user.role, user.firstName, user.lastName, user.displayName, user.school, profile._json.ipaddr]
		).then(() => {
			return user;
		});

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
		const q1 = "SELECT id FROM lesson WHERE lesson.groupId = ?";
		const q2 = "INSERT INTO presence (lessonId,studentId) VALUES (?,?)";
		return this.query(q1, [groupId])
			.then((rows) => {
				const prs = rows.map((row) => {
					return this.query(q2, [row.id, userId]);
				});
				return Promise.all(prs);
			});
	}

	async _addEvaluation(userId, groupId) {
		return this.query(
			"INSERT INTO evaluation " +
			"(userId,courseId,assesment,explanation) VALUES " +
			"(?, " +
			"(SELECT courseId FROM course_group WHERE course_group.id = ?), " +
			"NULL, NULL)",
			[userId, groupId]);
	}

	async _addParticipant(userId, groupId) {
		return this.query(
			"INSERT INTO participant " +
			"(userId,courseGroupId) VALUES" +
			"(?,?)",
			[userId, groupId]);
	}

	async updateALLLessonDates() {
		return this.query("SELECT id,period,day FROM course_group").then((rows) => {
			rows.map(({ id, period, day }) => {
				this.updateLessonDates(id, period, day);
			});
		});
	}

	async updateLessonDates(groupId, period, day) {
		const schedule = require("../lib/schedule");
		for (let i = 0; i < 8; i++) {
			const q2 = "UPDATE lesson set date = ? WHERE courseGroupId = ? AND numberInBlock = ?";
			await this.query(q2, [schedule.getLessonDate(period, i + 1, day), groupId, i + 1]);
		}
	}

	async addLessons(groupId, period, day) {
		const schedule = require("../lib/schedule");

		for (let i = 0; i < 8; i++) {
			const q2 = "INSERT INTO lesson (courseGroupId,date,kind,activities,numberInBlock) VALUES (?,?,?,?,?)";
			await this.query(q2, [groupId, schedule.getLessonDate(period, i + 1, day), "", "", i + 1]);
		}
	}

	async addAllLessons() {
		const q1 = "SELECT id,period,day FROM course_group"
		this.query(q1).then((rows) => {
			rows.map((row) => {
				this.addLessons(row.id, row.period, row.day);
			});
		});
	}


}



module.exports = FunctionDB;

