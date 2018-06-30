class GroupDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getGroups() {
		return this.mainDb.connection.query(
			"SELECT  " +
			"qhighschool.group.*, " +
			"qhighschool.course.name AS courseName, " +
			"qhighschool.course.description AS courseDescription, " +
			"qhighschool.subject.id AS subjectId, " +
			"qhighschool.subject.name AS subjectName, " +
			"qhighschool.subject.description AS subjectDescription, " +
			"CONCAT(qhighschool.user.firstName, ' ', qhighschool.user.lastName) AS teacherName " +
			"FROM qhighschool.group  " +
			"INNER JOIN qhighschool.course ON qhighschool.course.id = qhighschool.group.courseId  " +
			"INNER JOIN qhighschool.user ON qhighschool.user.id = qhighschool.group.teacherId " +
			"INNER JOIN qhighschool.subject ON qhighschool.subject.id = qhighschool.course.subjectId " +
			"ORDER BY group.period"
		);
	}

	async getGroup(groupId) {
		if (groupId >= 0) {
			return this.mainDb.connection.query(
				"SELECT  " +
				"qhighschool.group.*, " +
				"qhighschool.course.name AS courseName, " +
				"qhighschool.course.description AS courseDescription, " +
				"qhighschool.subject.name AS subjectName, " +
				"qhighschool.subject.id AS subjectId, " +
				"qhighschool.subject.description AS subjectDescription, " +
				"CONCAT(qhighschool.user.firstName, ' ', qhighschool.user.lastName) AS teacherName " +
				"FROM qhighschool.group  " +
				"INNER JOIN qhighschool.course ON qhighschool.course.id = qhighschool.group.courseId  " +
				"INNER JOIN qhighschool.user ON qhighschool.user.id = qhighschool.group.teacherId " +
				"INNER JOIN qhighschool.subject ON qhighschool.subject.id = qhighschool.course.subjectId WHERE qhighschool.group.id = ?"
				, [groupId]).then(groups => {
					if (groups.length === 1) {
						return groups[0];
					}
					throw new Error("groupId is invalid");
				});
		} else {
			throw new Error("groupId must be a number");
		}
	}

	async getEnrollments(token, groupId) {
		if (groupId >= 0) {
			return this.mainDb.checkToken(token,["teacher"]).then(() => this.mainDb.connection.query(
				"SELECT user.* FROM enrollment " +
				"INNER JOIN user ON user.id = enrollment.studentId WHERE enrollment.groupId = ?; "
				, [groupId]).then(enrollments => {
						return enrollments;
				}));
		} else {
			throw new Error("groupId must be a number");
		}
	}

}

module.exports = GroupDB;
