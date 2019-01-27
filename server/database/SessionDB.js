const User = require("../databaseDeclearations/UserDec");
const LoggedIn = require("../databaseDeclearations/LoggedInDec");
const Participant = require("../databaseDeclearations/ParticipantDec");

class SerialisedUser {

	constructor(id, email, role, displayName, groupIds, school) {
		this.id = id;
		this.email = email;
		this.role = role;
		this.displayName = displayName;
		this.groupIds = groupIds;
		if (this.role === "grade_admin") {
			this.school = school;
		}
	}

	inGroup(groupId) {
		if (this.isAdmin()) {
			return true;
		}
		return this.groupIds.indexOf(groupId + "") !== -1;
	}

	isAdmin() {
		return this.role === "admin";
	}

	isTeacher() {
		if (this.isAdmin()) {
			return true;
		}
		return this.role === "teacher";
	}

	isGradeAdmin() {
		if (this.isAdmin()) {
			return true;
		}
		return this.role === "grade_admin";
	}

	isStudent() {
		return this.role === "student";
	}

}

class SessionDB {

	async getUserByEmail(email) {
		return User.findOne({
			attributes: ["id", "role"],
			where: {
				email
			}
		}).then((user) => {
			return user
		});
	}

	async getParticipatingGroupsIds(userId) {
		return Participant.findAll({ where: { userId }, attributes: ["courseGroupId"] })
			.map(u => u.courseGroupId + "");
	}

	async getUserByToken(token) {
		return LoggedIn.findAll({
			where: {
				token,
				active: true,
			},
			include: {
				model: User,
				attributes: ["id", "email", "role", "displayName", "school"],
			}
		}).then(async (loginData) => {
			if (loginData.length === 1) {
				const user = loginData[0].user;
				const groupIds = await this.getParticipatingGroupsIds(user.id);
				return new SerialisedUser(user.id, user.email, user.role, user.displayName, groupIds, user.school);
			} else {
				return null;
			}
		});
	}

	async createTokenForUser(profile) {
		const userId = (await User.findOne({ where: { email: profile.upn }, attributes: ["id"] })).id;
		const token = require('uuid/v4')()
		await this.destroySession(profile.upn);
		await LoggedIn.create({
			userId,
			token,
			ip: profile._json.ipaddr,
			active: true,
		});
		return token;
	}

	async destroySession(email) {
		const userId = (await User.findOne({ where: { email }, attributes: ["id"] })).id;
		return LoggedIn.update({
			active: false,
		}, { where: { userId } });
	}

}

module.exports = new SessionDB();
