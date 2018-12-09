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
			foreknowledge: data.course.foreknowledge,
			studyTime: data.course.studyTime,
			subjectId: data.course.subject.id,
			subjectName: data.course.subject.name,
			subjectDescription: data.course.subject.description,
			teacherId: data.participants[0] ? data.participants[0].user.id : null,
			teacherName: data.participants[0] ? data.participants[0].user.displayName : null,
		}
	}

	async getGroups() {
		return Group.findAll({
			order: [["period", "ASC"]],
			include: [{
				model: Course, attributes: ["name", "description", "foreknowledge", "studyTime"], include: [{
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
				model: Course, attributes: ["name", "description", "foreknowledge", "studyTime"], include: [{
					model: Subject, attributes: ["id", "name", "description"]
				}]
			},
			{
				model: Participant, limit: 1, where: { participatingRole: "teacher" }, include: [{
					model: User, attributes: ["id", "displayName"],
				}]
			}]
		}).then(this._mapGroup);
	}

	async getEnrollments(groupId) {
		return Enrollment.findAll({
			attributes: [],
			where: {
				courseGroupId: groupId
			},
			include: [{
				model: User,
				order: [
					["displayName", "DESC"]
				]
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
				order: [
					["displayName", "DESC"]
				]
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

	async getEvaluations(groupId) {
		return Evaluation.findAll({
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
		});
	}

	async setEvaluation(newEv) {
		return Evaluation.findByPrimary(evaluation.id).then(oldEv => {
			if (newEv.id === oldEv.id && newEv.userId === oldEv.userId) {
				return oldEv.update(newEv);
			} else {
				throw new Error("authentication!");
			}
		});
	}

}

module.exports = new GroupDB(DB);
