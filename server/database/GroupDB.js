const Group = require("../dec/CourseGroupDec");
const Course = require("../dec/CourseDec");
const Subject = require("../dec/SubjectDec");
const Participant = require("../dec/ParticipantDec");
const User = require("../dec/UserDec");
const Enrollment = require("../dec/EnrollmentDec");
const Lesson = require("../dec/LessonDec");
const Evaluation = require("../dec/EvaluationDec");
const Presence = require("../dec/PresenceDec");
const functionDb = require("../database/FunctionDB");
const officeEndpoints = require("../office/officeEndpoints");

exports._mapGroup = (data) => {
	let groupName = data.course.name;
	groupName = groupName.charAt(0).toUpperCase() + groupName.slice(1);
	return {
		id: data.id + "",
		courseId: data.courseId,
		day: data.day,
		period: data.period,
		schoolYear: data.schoolYear,
		enrollableFor: data.enrollableFor,
		courseName: groupName,
		courseDescription: data.course.description,
		remarks: data.course.remarks,
		studyTime: data.course.studyTime,
		subjectId: data.course.subject.id,
		subjectName: data.course.subject.name,
		subjectDescription: data.course.subject.description,
		subjectAbbreviation: data.course.subject.abbreviation,
		teacherId: data.participants[0] ? data.participants[0].user.id : null,
		teacherName: data.participants[0] ? data.participants[0].user.displayName : null,
		graphId: data.graphId,
		teamUrl: data.teamUrl,
	}
}

exports.getGroups = async (userId) => {
	let groups = await Group.findAll({
		order: [["period", "ASC"]],
		include: [{
			model: Course, attributes: ["name", "description", "remarks", "studyTime"], include: [{
				model: Subject, attributes: ["id", "name", "description"]
			}]
		},
		{
			model: Participant, limit: 1, where: { participatingRole: "teacher" }, include: [{
				model: User, attributes: ["id", "displayName"],
			}]
		}]
	});
	groups = groups.map(this._mapGroup);
	groups = await Promise.all(groups.map(group => exports.appendEvaluation(group, userId)));
	return groups;
};

exports.setFullGroup = async (data) => {
	let group = await Group.findByPk(data.groupId);
	group = await group.update(data);
	await functionDb.updateLessonDates(group.id, group.period, group.day);
	await officeEndpoints.updateClass(group.id);
	return group;
}

exports.setGroup = async (data) => {
	Group.findByPk(data.groupId).then(group => {
		return group.update(data);
	});
}

exports.getGroup = async (groupId, userId) => {
	let group = await Group.findByPk(groupId, {
		order: [["period", "ASC"]],
		include: [{
			model: Course,
			attributes: ["name", "description", "remarks", "studyTime"],
			include: [{ model: Subject }]
		}, {
			model: Participant, limit: 1, where: { participatingRole: "teacher" },
			include: [{
				model: User, attributes: ["id", "displayName"],
			}]
		}]
	});
	group = this._mapGroup(group);
	if (userId != null) {
		group = await exports.appendEvaluation(group, userId);
	}
	return group;
}

exports.appendEvaluation = async (group, userId) => {
	const evaluation = await Evaluation.findOne({
		attributes: ["id", "userId", "courseId", "type", "assesment", "explanation"],
		order: [["id", "DESC"]],
		raw: true,
		where: {
			userId: userId,
			courseId: group.courseId
		}
	});
	return {
		...group,
		evaluation,
	}
}

exports.getEnrollments = async groupId => {
	return Enrollment.findAll({
		attributes: [],
		where: {
			courseGroupId: groupId
		},
		include: [{
			model: User,
			order: [["displayName", "DESC"]]
		}]
	});
}

exports.setGraphId = async (groupId, graphId) => {
	const g = await Group.findByPk(groupId);
	g.update({ graphId });
}

exports.getEnrollments = async (groupId) => {
	return Enrollment.findAll({
		attributes: [],
		where: {
			courseGroupId: groupId
		},
		include: [{
			model: User,
			order: [["displayName", "DESC"]]
		}]
	}).then((e) => e.map((e) => e.user));
}

exports.getParticipants = async (groupId, teacher) => {
	const participants = await Participant.findAll({
		attributes: ["participatingRole", "userId"],
		where: {
			courseGroupId: groupId,
		},
		include: {
			model: User,
			attributes: teacher ?
				["id", "role", "school", "firstName", "lastName", "displayName", "year", "profile", "level", "preferedEmail", "phoneNumber", "email"] :
				["id", "role", "displayName", "firstName", "lastName", "level", "profile", "year"],
			order: [["displayName", "DESC"]]
		},
	});
	return participants.map(p => {
		return {
			...p.dataValues.user.dataValues,
			participatingRole: p.dataValues.participatingRole,
		}
	});
}

exports.addUserToGroup = async (userId, courseGroupId, participatingRole) => {
	await _addParticipant(userId, courseGroupId, participatingRole);
	if (participatingRole === "student") {
		await _addPresence(userId, courseGroupId);
		await _acceptEnrollment(userId, courseGroupId);
	}
}

async function _acceptEnrollment(userId, courseGroupId) {
	return Enrollment.update({
		accepted: "true"
	}, {
			where: {
				userId,
				courseGroupId,
			}
		});
}

async function _addPresence(userId, courseGroupId) {
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

async function _addParticipant(userId, courseGroupId, participatingRole) {
	return Participant.findOrCreate({
		where: {
			userId,
			courseGroupId,
		},
		defaults: {
			userId,
			courseGroupId,
			participatingRole,
		}
	});
}

exports.getLessons = async (groupId, userId) => {
	if (userId == null) {
		return Lesson.findAll({ where: { courseGroupId: groupId } });
	} else {
		return Lesson.findAll({
			where: { courseGroupId: groupId },
		}).then(async lessons => {
			const presences = await Promise.all(lessons.map(lesson => Presence.findOne({
				attributes: ["lessonId", "userId", "userStatus"],
				where: {
					lessonId: lesson.id,
					userId: userId,
				}
			})));
			return lessons.map((lesson, index) => presences[index] == null ? lesson : { ...lesson.dataValues, userStatus: presences[index].userStatus });
		});
	}
}

exports.setLesson = async (lesson) => {
	return Lesson.findByPk(lesson.id).then(l => {
		if (l.courseGroupId === lesson.courseGroupId) {
			return l.update(lesson);
		}
	});
}

exports.getPresence = async (groupId) => {
	return Presence.findAll({
		include: {
			model: Lesson,
			attributes: [],
			where: {
				courseGroupId: groupId,
			}
		}
	});
}

exports.setPresence = async (presence) => {
	return Presence.findByPk(presence.id).then(prs => {
		prs.update({
			status: presence.status,
		});
	});
}

exports.getEvaluations = async (groupId) => {
	const participants = await Participant.findAll({
		attributes: ["userId"],
		where: { courseGroupId: groupId, participatingRole: "student" },
		include: {
			attributes: ["displayName"],
			model: User,
		},
	});
	const evaluations = participants
		.map(p => functionDb.findEvaluation(p.userId, groupId));
	return Promise.all(evaluations);
}

exports.updateUserStatus = async (userId, lessonId, newStatus) => {
	const p = await Presence.findOne({ where: { userId, lessonId } });
	if (p != null) {
		p.update({ userStatus: newStatus });
	} else {
		throw new Error("No presence data available");
	}
}

exports.addGroup = async ({ courseId, mainTeacherId }) => {
	const group = await Group.create({
		day: "maandag",
		courseId,
		period: 1,
		schoolYear: "2019/2020",
	});
	functionDb.addLessons(group.id, 1, "maandag");
	Participant.create({
		participatingRole: "teacher",
		courseGroupId: group.id,
		userId: mainTeacherId,
	});
	officeEndpoints.createClass(group.id);
	return group;
}

exports.setEvaluation = async ({ userId, assesment, type, explanation, updatedByUserId, updatedByIp, courseId }) => {
	return Evaluation.create({
		userId,
		assesment,
		type,
		explanation,
		updatedByIp,
		updatedByUserId,
		courseId,
	});
}

exports.getGraphIdFromGroupId = async (groupId) => {
	const group = await Group.findByPk(groupId, { attributes: ["graphId"] });
	return group.graphId;
}