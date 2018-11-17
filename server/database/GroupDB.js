const Group = require("../databaseDeclearations/CourseGroupDec");
const Course = require("../databaseDeclearations/CourseDec");
const Subject = require("../databaseDeclearations/SubjectDec");
const Participant = require("../databaseDeclearations/ParticipantDec");
const User = require("../databaseDeclearations/UserDec");

class GroupDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async query(sqlString, value) {
		return this.mainDb.connection.query(sqlString, value);
	}

	_mapGroup(data) {
		return {
			id: data.id,
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

	async setGroup(data) {
		const q1 = "UPDATE course_group SET courseId=?,`day`=?,period=?,schoolYear=?,enrollableFor=? WHERE id=?";
		return this.query(q1, [data.courseId, data.day, data.period, data.schoolYear, data.enrollableFor, data.groupId]).then((rows) => {
			if (rows.changedRows == 1) {
				this.mainDb.function.updateLessonDates(data.groupId,data.period,data.day);
			}
		});
	}

	async getGroup(groupId) {
		return Group.findByPrimary(groupId, {
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
		if (groupId >= 0) {
			return this.query(
				"SELECT user_data.* FROM enrollment " +
				"INNER JOIN user_data ON user_data.id = enrollment.studentId WHERE enrollment.groupId = ?; "
				, [groupId]).then(enrollments => {
					return enrollments;
				});
		} else {
			throw new Error("groupId must be a number");
		}
	}


	async getParticipants(groupId) {
		if (groupId >= 0) {
			return this.query(
				"SELECT user_data.id,role,school,firstName,lastName,displayName,year,profile FROM participant " +
				"INNER JOIN user_data ON user_data.id = participant.userId WHERE participant.courseGroupId = ?; "
				, [groupId]).then(participants => {
					return participants;
				});
		} else {
			throw new Error("groupId must be a number");
		}
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
		console.log(groupId);
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

	async addGroup(data) {
		const q1 = "INSERT INTO course_group (courseId,`day`,teacherId,period,schoolYear) VALUES (?,?,?,?,?);";
		return this.query(q1, [data.courseId, data.day, data.teacherId, data.period, data.schoolYear])
			.then((rows) => this.mainDb.function.addLessons(rows.insertId, data.period, data.day));
	}

}

module.exports = GroupDB;
