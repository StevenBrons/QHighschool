const User = require("../dec/UserDec");
const LoggedIn = require("../dec/LoggedInDec");
const Participant = require("../dec/ParticipantDec");
const Group = require("../dec/CourseGroupDec");
const Course = require("../dec/CourseDec");

class SerialisedUser {

	constructor(id, email, role, displayName, groupIds, subjectIds, school, token) {
		this.id = id;
		this.email = email;
		this.role = role;
		this.displayName = displayName;
		this.groupIds = groupIds;
		this.subjectIds = subjectIds;
		if (this.role === "grade_admin") {
			this.school = school;
		}
		this.token = token;
	}

	inGroup(groupId) {
		if (this.isAdmin()) {
			return true;
		}
		return this.groupIds.indexOf(groupId + "") !== -1;
	}

	inSubjectGroup(subjectId) {
		if (this.isAdmin()) {
			return true;
		}
		return this.subjectIds.indexOf(subjectId + "") !== -1;
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
		return this.role === "grade_admin" && this.school != null;
	}

	isStudent() {
		return this.role === "student";
	}

}

exports.getUserByEmail = async (email) => {
	return User.findOne({
		attributes: ["id", "role"],
		where: {
			email
		}
	});
}

exports.getParticipatingGroupsIds = async (userId) => {
	return Participant.findAll({ where: { userId }, attributes: ["courseGroupId"] })
		.map(u => u.courseGroupId + "");
}

async function getSubjectIdOfGroupId(groupId) {
	const g = await Group.findByPk(groupId, {
		attributes: [], raw: true,
		include: {
			model: Course,
			attributes: ["subjectId"],
		}
	});
	return g["course.subjectId"] + "";
}

exports.getUserByToken = async (token) => {
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
			const subjectIds = await Promise.all(groupIds.map(getSubjectIdOfGroupId));
			return new SerialisedUser(user.id, user.email, user.role, user.displayName, groupIds, subjectIds, user.school, token);
		} else {
			return null;
		}
	});
}

exports.createTokenForUser = async ({ email }) => {
	const userId = (await User.findOne({ where: { email: email }, attributes: ["id"] })).id;
	const token = require('uuid/v4')()
	await this.destroySession(email)
	await LoggedIn.create({
		userId,
		token,
		ip: "_v2.0 unknown_",
		active: true,
	});
	return token;
}

exports.destroySession = async (email) => {
	const userId = (await User.findOne({ where: { email }, attributes: ["id"] })).id;
	return LoggedIn.update({
		active: false,
	}, { where: { userId } });
}
