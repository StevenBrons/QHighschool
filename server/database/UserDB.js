class UserDB {

	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getSelf(userId) {
		return this.mainDb.connection.query(
			"SELECT * FROM user_data " +
			"WHERE id = ?;",
			[userId]).then((rows) => {
				return this.getNotifications(userId).then((notifications) => {
					return {
						...rows[0],
						notifications,
					};
				})
			});
	}

	async getUser(userId) {
		return this.mainDb.connection.query(
			"SELECT * FROM user_data " +
			"WHERE id = ?;",
			[userId]).then((rows) => {
				if (rows.length === 1) {
					let user = rows[0];
					return {
						firstName: user.firstName,
						lastName: user.lastName,
						displayName: user.displayName,
						email: user.email,
						role: user.role,
						school: user.school,
						profile: user.profile,
					}
				} else {
					return {
					}
				}
			});
	}

	async getEnrollments(userId) {
		return this.mainDb.connection.query(
			"SELECT course_group.*, " +
			"course.name AS courseName, " +
			"course.description AS courseDescription, " +
			"school_subject.id AS subjectId, " +
			"school_subject.name AS subjectName, " +
			"school_subject.description AS subjectDescription, " +
			"CONCAT(user_data.firstName, ' ', user_data.lastName) AS teacherName " +
			"FROM enrollment " +
			"INNER JOIN course_group ON course_group.id = enrollment.groupId " +
			"INNER JOIN course ON course.id = course_group.courseId " +
			"INNER JOIN user_data ON user_data.id = course_group.teacherId " +
			"INNER JOIN school_subject ON school_subject.id = course.subjectId " +
			"WHERE enrollment.studentId = ?" +
			[userId]).then(async (enrollments) => {
				if (enrollments.length > 0) {
					return enrollments;
				} else {
					return [];
				}
			});
	}

	async setUser(userId, data) {
		if (data.preferedEmail == null) {
			throw new Exception("The property preferedEmail is required");
		}
		if (data.profile == null) {
			throw new Exception("The property profile is required");
		}
		if (data.phoneNumber == null) {
			throw new Exception("The property phoneNumber is required");
		}

		return this.mainDb.connection.query(
			"UPDATE user_data SET " +
			"preferedEmail = ?, " +
			"profile = ?, " +
			"phoneNumber = ? " +
			"WHERE id = ? " +
			[data.preferedEmail, data.profile, data.phoneNumber, userId]);
	}

	async addUserEnrollment(userId, groupId) {
		return this.mainDb.checkToken(token, ["student"]).then(() => this.mainDb.connection.query(
			"INSERT INTO enrollment " +
			"(studentId,groupId) VALUES" +
			"(? ,?)",
			[userId, groupId]
		));
	}

	async removeUserEnrollment(userId, groupId) {
		return this.mainDb.connection.query(
			"DELETE FROM enrollment " +
			"WHERE studentId = ? " +
			"AND groupId = ?",
			[userId, groupId]
		);
	}

	async getNotifications(userId) {
		return this.mainDb.connection.query(
			"		SELECT  " +
			"		*  " +
			"	FROM  " +
			"		notifications  " +
			"	WHERE  " +
			"		userId = ? ",
			[userId]
		);
	}

}

module.exports = UserDB;
