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
	return Group.findAll({
		order: [["period", "ASC"]],
		include: [{
			model: Course, attributes: ["name", "description", "remarks", "studyTime"], include: [{
				model: Subject, attributes: ["id", "name", "description", "abbreviation"]
			}]
		},
		{
			model: Participant, limit: 1, where: { participatingRole: "teacher" }, include: [{
				model: User, attributes: ["id", "displayName"],
			}]
		}]
	}).then(data => data.map(this._mapGroup))
		.then(data => Promise.all(data.map(this.appendEvaluation(userId))));
};

exports.setFullGroup = async (data) => {
	let group = await Group.findByPrimary(data.groupId);
	if (!group) throw "Group not found";
	group = await group.update(data);
	await functionDb.updateLessonDates(data.groupId, data.period, data.day);
	return group;
}

exports.setGroup = async (data) => {
	const group = Group.findByPrimary(data.groupId);
	return group.update({
		enrollableFor: data.enrollableFor,
	});
}

exports.getGroup = async (groupId) => {
	return Group.findByPk(groupId, {
		order: [["period", "ASC"]],
		include: [{
			model: Course,
			attributes: ["name", "description", "remarks", "studyTime"],
			include: [
				{
					model: Subject, attributes: ["id", "name", "description", "abbreviation"]
				},
			]
		},
		{
			model: Participant, limit: 1, where: { participatingRole: "teacher" }, include: [{
				model: User, attributes: ["id", "displayName"],
			}]
		},
		]
	}).then(a => this._mapGroup(a))
}

exports.appendEvaluation = async (userId) => {
	return async function addEvaluation(group) {
		return Evaluation.findOne({
			attributes: ["id", "userId", "courseId", "type", "assesment", "explanation"],
			order: [["id", "DESC"]],
			where: {
				userId: userId,
				courseId: group.courseId
			}
		}).then(evaluation => {
			return {
				...group,
				evaluation,
			}
		});
	}
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
	await functionDb.addLessons(group.id, 1, "maandag");
	await Participant.create({
		participatingRole: "teacher",
		courseGroupId: group.id,
		userId: mainTeacherId,
	});
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