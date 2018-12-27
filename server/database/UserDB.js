const User = require('../databaseDeclearations/UserDec');
const Enrollment = require('../databaseDeclearations/EnrollmentDec');
const groupDb = require('../database/GroupDB');

class UserDB {

	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async query(sqlString, value) {
		return this.mainDb.connection.query(sqlString, value);
	}

	async getSelf(userId) {
		return User.findByPk(userId).then(async (data) => {
			const user = data.dataValues;
			return {
				...user,
				notifications: await this.getNotifications(userId),
				participatingGroupIds: await this.getParticipatingGroupIds(userId, user.role === "admin"),
			};
		});
	}

	async getUser(userId) {
		return User.findByPk(userId).then((data) => {
			if (data) {
				const user = data.dataValues;
				return {
					id: user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					displayName: user.displayName,
					email: user.email,
					role: user.role,
					school: user.school,
					year: user.year,
					profile: user.profile,
					level: user.level,
				}
			} else {
				throw new Error("User not found");
			}
		});
	}

	async getEnrollments(userId) {
		return Enrollment.findAll({
			where: {
				userId,
			}
		}).then(async (rows) => {
			return Promise.all(rows.map(row => groupDb.getGroup(row.courseGroupId.userId)));
		});
	}

	async setUser({ userId, preferedEmail, profile, phoneNumber, level, year }) {
		if (profile == null || profile == "") {
			throw new Error("The property profile is required");
		}
		if (phoneNumber == null || phoneNumber == "") {
			throw new Error("The property phoneNumber is required");
		}
		if (level == null || level == "") {
			throw new Error("The property level is required");
		}
		if (year == null || year == "") {
			throw new Error("The property year is required");
		}
		const re1 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
		if (!re1.test(preferedEmail)) {
			throw new Error("The property preferedEmail does not comply with requirements");
		}
		const re2 = /^\+?[1-9][\d]*$/i;
		if (!re2.test(year)) {
			throw new Error("The property year does not comply with requirements");
		}
		if (parseInt(year) > 6) {
			throw new Error("The property year must be below or equal to 6");
		}
		if (parseInt(year) < 1) {
			throw new Error("The property year must be 1 or higher");
		}
		const re3 = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i;
		if (!re3.test(phoneNumber)) {
			throw new Error("The property phoneNumber does not comply with requirements");
		}
		return User.update({
			preferedEmail: preferedEmail,
			profile: profile,
			phoneNumber: phoneNumber,
			year: year,
			level: level,
		}, {
				where: {
					id: userId,
				}
			});
	}

	async addUserEnrollment(userId, courseGroupId) {
		return Enrollment.create({
			userId,
			courseGroupId,
		});
	}

	async removeUserEnrollment(userId, courseGroupId) {
		return Enrollment.destroy({
			where: {
				userId,
				courseGroupId,
			}
		}).then(() => null);
	}

	async getNotifications(userId) {
		return this.query("SELECT * FROM notifications WHERE userId = ?", [userId]);
	}

	async getParticipatingGroupIds(userId, admin) {
		let q1 = "SELECT courseGroupId FROM participant WHERE userId = ?";
		if (admin) {
			q1 = "SELECT id AS courseGroupId FROM course_group";
		}
		return this.query(q1, [userId])
			.then(rows => rows.map(row => row.courseGroupId + ""));
	}

	async getGroups(userId, admin) {
		let q1 = "SELECT participant.courseGroupId FROM participant WHERE participant.userId = ?";
		if (admin) {
			q1 = "SELECT id AS courseGroupId FROM course_group";
		}
		return this.query(q1, [userId])
			.then((rows) => {
				const groupPromises = rows.map((row) => {
					return groupDb.getGroup(row.courseGroupId, userId);
				});
				return Promise.all(groupPromises);
			});
	}

}

module.exports = UserDB;
