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
const courseDb = require("../database/CourseDB");

class GroupDB {

	_mapGroup(data) {
		return {
			id: data.id + "",
			courseId: data.courseId,
			day: data.day,
			period: data.period,
			schoolYear: data.schoolYear,
			enrollableFor: data.enrollableFor,
			courseName: data.course.name,
			courseDescription: data.course.description,
			remarks: data.course.remarks,
			studyTime: data.course.studyTime,
			subjectId: data.course.subject.id,
			subjectName: data.course.subject.name,
			subjectDescription: data.course.subject.description,
			teacherId: data.participants[0] ? data.participants[0].user.id : null,
			teacherName: data.participants[0] ? data.participants[0].user.displayName : null,
		}
	}

	async getGroups(userId) {
		return Group.findAll({
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
		}).then(data => data.map(this._mapGroup))
			.then(data => Promise.all(data.map(this.appendEvaluation(userId))));
	};

	async setFullGroup(data) {
		return Group.findByPrimary(data.groupId).then(group => {
			if (group) {
				return group.update(data).then(() => {
					functionDb.updateLessonDates(data.groupId, data.period, data.day);
				});
			}
		});
	}

	async setGroup(data) {
		Group.findByPrimary(data.groupId).then(group => {
			return group.update(data);
		});
	}

	async getGroup(groupId) {
		return Group.findByPk(groupId, {
			order: [["period", "ASC"]],
			include: [{
				model: Course,
				attributes: ["name", "description", "remarks", "studyTime"],
				include: [
					{
						model: Subject, attributes: ["id", "name", "description"]
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

	appendEvaluation(userId) {
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

	async getEnrollments(groupId) {
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

	async getParticipants(groupId, teacher) {
		return Participant.findAll({
			where: {
				courseGroupId: groupId,
			},
			include: {
				model: User,
				attributes: teacher ?
					["id", "role", "school", "firstName", "lastName", "displayName", "year", "profile", "level", "preferedEmail", "phoneNumber", "email"] :
					["id", "role", "displayName", "firstName", "lastName","level","profile","year"],
				order: [["displayName", "DESC"]]
			},
		}).then(rows => rows.map(row => row.user));
	}

	async getLessons(groupId, userId) {
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

	async setLesson(lesson) {
		return Lesson.findByPk(lesson.id).then(l => {
			if (l.courseGroupId === lesson.courseGroupId) {
				return l.update(lesson);
			}
		});
	}

	async setLessons(lessons) {
		return Promise.all(lessons.map((lesson) => {
			return Lesson.findByPk(lesson.id).then(l => {
				return l.update(lesson);
			});
		}));
	}

	async getPresence(groupId) {
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

	async setPresence(presence) {
		return Presence.findByPk(presence.id).then(prs => {
			prs.update({
				status: presence.status,
			});
		});
	}

	async _findEvaluation(userId, groupId) {
		return Evaluation.findOne({
			attributes: ["id", "type", "assesment", "explanation", "userId", "courseId", "updatedAt"],
			order: [["id", "DESC"]],
			where: { userId },
			include: {
				model: Course,
				attributes: ["id"],
				include: {
					model: Group,
					attributes: ["id"],
					where: {
						id: groupId,
					}
				}
			}
		});
	}

	async getEvaluations(groupId) {
		const participants = await Participant.findAll({
			attributes: ["userId"],
			where: { courseGroupId: groupId },
			include: {
				attributes: ["displayName"],
				model: User,
				order: [["displayName", "DESC"]],
			},
		});
		const evaluations = participants
			.sort((p1, p2) => p1.user.displayName.toLowerCase() > p2.user.displayName.toLowerCase())
			.map(p => this._findEvaluation(p.userId, groupId)
				.then(async evaluation => {
					if (evaluation == null) {
						return {
							type: "decimal",
							assesment: "",
							courseId: await courseDb.getCourseIdFromGroupId(groupId),
							explanation: "",
							userId: p.userId,
						}
					}
					delete evaluation.course;
					return evaluation;
				}));

		return Promise.all(evaluations);
	}

	async updateUserStatus(userId, lessonId, newStatus) {
		const p = await Presence.findOne({ where: { userId, lessonId } });
		if (p != null) {
			p.update({ userStatus: newStatus });
		} else {
			throw new Error("No presence data available");
		}
	}

	async addGroup({ day, courseId, enrollableFor, period, schoolYear, mainTeacherId }) {
		const group = await Group.create({
			day,
			courseId,
			enrollableFor,
			period,
			schoolYear,
		});
		await functionDb.addLessons(group.id, period, day);
		await Participant.create({
			participatingRole: "teacher",
			courseGroupId: group.id,
			userId: mainTeacherId,
		});
	}

	async setEvaluation({ userId, assesment, type, explanation, updatedByUserId, updatedByIp, courseId }) {
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

}

module.exports = new GroupDB();

