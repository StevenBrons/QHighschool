const Group = require("../databaseDeclearations/CourseGroupDec");
const Course = require("../databaseDeclearations/CourseDec");
const Subject = require("../databaseDeclearations/SubjectDec");
const Participant = require("../databaseDeclearations/ParticipantDec");
const User = require("../databaseDeclearations/UserDec");
const Enrollment = require("../databaseDeclearations/EnrollmentDec");
const Lesson = require("../databaseDeclearations/LessonDec");
const Evaluation = require("../databaseDeclearations/EvaluationDec");
const Presence = require("../databaseDeclearations/PresenceDec");
let DB = require("../database/MainDB");

class GroupDB {

	constructor(mainDb) {
		this.mainDb = mainDb;
	}

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
			evaluation: data.course.evaluations ? data.course.evaluations[0] : null,
		}
	}

	async getGroups() {
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
		}).then(data => data.map(this._mapGroup));
	};

	async setFullGroup(data) {
		return Group.findByPrimary(data.groupId).then(group => {
			if (group) {
				return group.updateAttributes(data).then(() => {
					require('./MainDB').function.updateLessonDates(data.groupId, data.period, data.day);
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
		}).then(a => this._mapGroup(a));
	}

	async appendEvaluation(userId) {
		return async function addEvaluation(group) {
			return Evaluation.find({
				attributes: ["id", "userId", "courseId", "type", "assesment", "explanation"],
				where: {
					userId: userId,
					courseId: group.courseId
				}
			}).then(evaluation => {
				return {
					...group,
					evaluation: evaluation
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
			if (l.groupId === lesson.groupId) {
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
		return Presence.findById(presence.id).then(prs => {
			prs.update({
				status: presence.status,
			});
		});
	}

	selectDistinct(column) {
		return function distinct(rows) {
			let distinct = [];
			return rows.filter(row => {
				if (distinct.indexOf(row[column]) == -1) {
					distinct.push(row[column]);
					return true;
				} else {
					return false;
				}
			});
		}
	}

	async getEvaluations(groupId) {
		return Evaluation.findAll({
			order: [["id", "DESC"]],
			include: {
				attributes: [],
				model: Course,
				include: {
					model: Group,
					attributes: [],
					where: {
						id: groupId,
					}
				}
			}
		}).then(this.selectDistinct("userId"));
	}

	async setEvaluation({ userId, assesment, type, explanation, updatedByUserId, updatedByIp }) {
		return Evaluation.create({
			userId,
			assesment,
			type,
			explanation,
			updatedByIp,
			updatedByUserId,
		});
	}

}

module.exports = new GroupDB(DB);

