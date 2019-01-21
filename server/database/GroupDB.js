const Group = require("../databaseDeclearations/CourseGroupDec");
const Course = require("../databaseDeclearations/CourseDec");
const Subject = require("../databaseDeclearations/SubjectDec");
const Participant = require("../databaseDeclearations/ParticipantDec");
const User = require("../databaseDeclearations/UserDec");
const Enrollment = require("../databaseDeclearations/EnrollmentDec");
const Lesson = require("../databaseDeclearations/LessonDec");
const Evaluation = require("../databaseDeclearations/EvaluationDec");
const Presence = require("../databaseDeclearations/PresenceDec");
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
				return group.updateAttributes(data).then(() => {
					functionDb.updateLessonDates(data.groupId, data.period, data.day);
				});
			}
		});
	}

	async setGroup(data) {
		Group.findByPrimary(data.groupId).then(group => {
			return group.updateAttributes(data);
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
				order: [["id","DESC"]],
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
				attributes: teacher ? ["id", "role", "school", "firstName", "lastName", "displayName", "year", "profile", "level"] : undefined,
				order: [["displayName", "DESC"]]
			},
		}).then(rows => rows.map(row => row.user));
	}

	async getLessons(groupId) {
		return Lesson.findAll({
			where: {
				courseGroupId: groupId,
			}
		});
	}

	async setLesson(lesson) {
		return Lesson.findByPrimary(lesson.id).then(l => {
			if (l.courseGroupId === lesson.courseGroupId) {
				return l.update(lesson);
			}
		});
	}

	async setLessons(lessons) {
		return Promise.all(lessons.map((lesson) => {
			return Lesson.findByPrimary(lesson.id).then(l => {
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
							courseId: await courseDb.getCourseidFromGroupId(groupId),
							explanation: "",
							userId: p.userId,
						}
					}
					delete evaluation.course;
					return evaluation;
				}));

		return Promise.all(evaluations);
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

