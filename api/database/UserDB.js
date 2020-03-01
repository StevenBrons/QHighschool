const User = require('../dec/UserDec');
const Enrollment = require('../dec/EnrollmentDec');
const Notification = require('../dec/NotificationDec');
const groupDb = require('./GroupDB');
const Group = require('../dec/CourseGroupDec');
const Participant = require('../dec/ParticipantDec');
const mailApi = require('../mail/mailApi');

exports.getSelf = async (userId) => {
	return User.findByPk(userId).then(async (user) => {
		const dataValues = user.dataValues;
		return {
			...dataValues,
			notifications: await this.getNotifications(userId),
			participatingGroupIds: await this.getParticipatingGroupIds(userId, user.role === "admin"),
		};
	});
}

exports.getUser = async (userId) => {
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

exports.getEnrollments = async (userId) => {
	return Enrollment.findAll({
		where: {
			userId,
		}
	}).then(async (rows) => {
		return Promise.all(rows.map(row => groupDb.getGroup(row.courseGroupId)));
	});
}

exports.getNotifications = async (userId) => {
	return Notification.findAll({ where: { userId } });
}

exports.setUser = async ({ id, preferedEmail, profile, phoneNumber, level, year, remarks, needsProfileUpdate, examSubjects }) => {
	return User.update({
		year,
		level,
		preferedEmail,
		profile,
		remarks,
		phoneNumber,
		examSubjects,
		needsProfileUpdate,
	}, {
		where: {
			id,
		}
	});
}

exports.setFullUser = async (
	{ id, preferedEmail, profile, phoneNumber, level, year, remarks,
		needsProfileUpdate, role, school, displayName, examSubjects }) => {
	return User.update({
		preferedEmail: preferedEmail,
		profile: profile,
		phoneNumber: phoneNumber,
		year: year,
		level: level,
		examSubjects,
		remarks,
		needsProfileUpdate,
		role,
		school,
		displayName,
	}, {
		where: {
			id,
		}
	});
}

exports.addUserEnrollment = async (userId, courseGroupId) => {
	mailApi.sendEnrollmentMail(userId, courseGroupId);
	return Enrollment.create({
		userId,
		courseGroupId,
	});
}

exports.removeUserEnrollment = async (userId, courseGroupId) => {
	mailApi.sendDerollmentMail(userId, courseGroupId);
	return Enrollment.destroy({
		where: {
			userId,
			courseGroupId,
		}
	}).then(() => null);
}

exports.getGroups = async (userId, admin) => {
	const groupIds = await this.getParticipatingGroupIds(userId, admin);
	return Promise.all(groupIds.map(groupId => {
		return groupDb.getGroup(groupId, userId);
	}));
}

exports.getList = async () => {
	return User.findAll({
		attributes: ["id", "displayName"],
	});
}

exports.getParticipatingGroupIds = async (userId, admin) => {
	if (admin) {
		return Group.findAll({ attributes: ["id"] })
			.then(rows => rows.map(row => row.id + ""));
	} else {
		return Participant.findAll({ attributes: ["courseGroupId"], where: { userId } })
			.then(rows => rows.map(row => row.courseGroupId + ""));
	}
}

exports.getGroups = async (userId, admin) => {
	const groupIds = await this.getParticipatingGroupIds(userId, admin);
	return Promise.all(groupIds.map(groupId => {
		return groupDb.getGroup(groupId, userId);
	}));
}
