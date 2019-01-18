const User = require('../databaseDeclearations/UserDec');
const Enrollment = require('../databaseDeclearations/EnrollmentDec');
const Notification = require('../databaseDeclearations/NotificationDec');
const Participant = require('../databaseDeclearations/ParticipantDec');
const Group = require('../databaseDeclearations/CourseGroupDec');
const groupDb = require('../database/GroupDB');

class UserDB {

	async getSelf(userId) {
		return User.findByPk(userId).then(async (user) => {
			const dataValues = user.dataValues;
			return {
				...dataValues,
				notifications: await this.getNotifications(userId),
				participatingGroupIds: await this.getParticipatingGroupIds(userId, user.role === "admin"),
			};
		});
	}

	async getUser(userId) {
		return User.findByPk(userId).then((user) => {
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
		});
	}

	async getEnrollments(userId) {
		return Enrollment.findAll({
			where: {
				userId,
			}
		}).then(async (rows) => {
			return Promise.all(rows.map(row => groupDb.getGroup(row.courseGroupId)));
		});
	}

	async setUser({ userId, preferedEmail, profile, phoneNumber, level, year }) {
		// if (profile == null || profile == "") {
		// 	throw new Error("The property profile is required");
		// }
		// if (phoneNumber == null || phoneNumber == "") {
		// 	throw new Error("The property phoneNumber is required");
		// }
		// if (level == null || level == "") {
		// 	throw new Error("The property level is required");
		// }
		// if (year == null || year == "") {
		// 	throw new Error("The property year is required");
		// }
		// const re1 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g;
		// if (!re1.test(preferedEmail)) {
		// 	throw new Error("The property preferedEmail does not comply with requirements");
		// }
		// const re2 = /^\+?[1-9][\d]*$/i;
		// if (!re2.test(year)) {
		// 	throw new Error("The property year does not comply with requirements");
		// }
		// if (parseInt(year) > 6) {
		// 	throw new Error("The property year must be below or equal to 6");
		// }
		// if (parseInt(year) < 1) {
		// 	throw new Error("The property year must be 1 or higher");
		// }
		// const re3 = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i;
		// if (!re3.test(phoneNumber)) {
		// 	throw new Error("The property phoneNumber does not comply with requirements");
		// }
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
		return Notification.findAll({ where: { userId } });
	}

	async getParticipatingGroupIds(userId, admin) {
		if (admin) {
			return Group.findAll({ attributes: ["id"] })
				.then(rows => rows.map(row => row.id + ""));
		} else {
			return Participant.findAll({ attributes: ["courseGroupId"], where: { userId } })
				.then(rows => rows.map(row => row.courseGroupId + ""));
		}
	}

	async getGroups(userId, admin) {
		const groupIds = await this.getParticipatingGroupIds(userId, admin);
		return Promise.all(groupIds.map(groupId => {
			return groupDb.getGroup(groupId, userId)
				.then(groupDb.appendEvaluation(userId))
		}));
	}

}

module.exports = new UserDB();
