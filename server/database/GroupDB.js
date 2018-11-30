const Group = require("../databaseDeclearations/CourseGroupDec");
const Course = require("../databaseDeclearations/CourseDec");
const Subject = require("../databaseDeclearations/SubjectDec");
const Participant = require("../databaseDeclearations/ParticipantDec");
const User = require("../databaseDeclearations/UserDec");
const Enrollment = require("../databaseDeclearations/EnrollmentDec");

class GroupDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async query(sqlString, value) {
		return this.mainDb.connection.query(sqlString, value);
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
					this.mainDb.function.updateLessonDates(data.groupId, data.period, data.day);
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
				attributes: teacher ? ["id", "role", "school", "firstname", "lastname", "displayName", "year", "profile", "level"] : undefined,
			}
		}).then(rows => rows.map(row => row.user));
	}

	async getLessons(groupId) {
		if (groupId >= 0) {
			return this.query(
				"SELECT lesson.* FROM lesson WHERE lesson.groupId = ? ",
				[groupId]).then(lessons => {
					return lessons;
				});
		} else {
			throw new Error("groupId must be a number");
		}
	}

	async setLessons(lessons) {
		const q1 = "UPDATE lesson SET kind = ?, activities = ?, `subject` = ?, presence = ? WHERE id = ?";
		return Promise.all(lessons.map((lesson) => {
			return this.query(q1, [lesson.kind, lesson.activities, lesson.subject, lesson.presence, lesson.id]);
		}));
	}

	async getPresence(groupId) {
		const q1 = "SELECT * FROM presence WHERE lessonId IN (SELECT id FROM lesson WHERE lesson.groupId = ?)";
		return this.query(q1, [groupId]);
	}

	async setPresence(presence) {
		const q1 = "UPDATE presence SET status = ? WHERE id = ?";
		return this.query(q1, [presence.status, presence.id]);
	}

	async getEvaluations(groupId) {
		const q1 = "SELECT * FROM evaluation WHERE evaluation.courseId = (SELECT course_group.courseId FROM course_group WHERE course_group.id = ?)";
		if (groupId >= 0) {
			return this.query(q1, [groupId]).then(evaluations => {
				return evaluations;
			});
		} else {
			throw new Error("groupId must be a number");
		}
	}

}

module.exports = GroupDB;
