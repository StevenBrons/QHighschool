class GroupDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getGroups() {
		return this.mainDb.connection.query(
			"SELECT course_group.*, " +
			"course.name AS courseName, " +
			"course.description AS courseDescription, " +
			"school_subject.id AS subjectId, " +
			"school_subject.name AS subjectName, " +
			"school_subject.description AS subjectDescription, " +
			"CONCAT(user_data.firstName, ' ', user_data.lastName) AS teacherName " +
			"FROM course_group " +
			"INNER JOIN course ON course.id = course_group.courseId " +
			"INNER JOIN user_data ON user_data.id = course_group.teacherId " +
			"INNER JOIN school_subject ON school_subject.id = course.subjectId " +
			"ORDER BY course_group.period"
		);
	}

	async getGroup(groupId) {
		if (groupId >= 0) {
			return this.mainDb.connection.query(
				"SELECT course_group.*, " +
				"course.name AS courseName, " +
				"course.description AS courseDescription, " +
				"school_subject.name AS subjectName, " +
				"school_subject.id AS subjectId, " +
				"school_subject.description AS subjectDescription, " +
				"CONCAT(user_data.firstName, ' ', user_data.lastName) AS teacherName " +
				"FROM course_group " +
				"INNER JOIN course ON course.id = course_group.courseId " +
				"INNER JOIN user_data ON user_data.id = course_group.teacherId " +
				"INNER JOIN school_subject ON school_subject.id = course.subjectId " +
				"WHERE course_group.id = ? ",
				[groupId]).then(groups => {
					if (groups.length === 1) {
						return groups[0];
					}
					throw new Error("groupId is invalid");
				});
		} else {
			throw new Error("groupId must be a number");
		}
	}

	async getEnrollments(groupId) {
		if (groupId >= 0) {
			return this.mainDb.connection.query(
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
			return this.mainDb.connection.query(
				"SELECT user_data.* FROM participant " +
				"INNER JOIN user_data ON user_data.id = participant.userId WHERE participant.groupId = ?; "
				, [groupId]).then(participants => {
					return participants;
				});
		} else {
			throw new Error("groupId must be a number");
		}
	}

	async getLessons(groupId) {
		if (groupId >= 0) {
			return this.mainDb.connection.query(
				"SELECT lesson.* FROM lesson WHERE lesson.groupId = ? ",
				[groupId]).then(lessons => {
					return lessons;
				});
		} else {
			throw new Error("groupId must be a number");
		}
	}

}

module.exports = GroupDB;
