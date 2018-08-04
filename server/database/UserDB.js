class UserDB {

	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getUser(token, userId) {
		let sendUser = async (users) => {
			if (users.length == 1) {
				let notifications = await this.getNotifications(users[0].id);
				return {
					...users[0],
					notifications,
				};
			} else {
				if (userId != null) {
					return this.mainDb.checkToken(token, ["student"]);
				}else {
					return this.mainDb.checkToken(token, ["teacher"]);
				}
			}
		}

		if (userId != null) {
			return this.mainDb.checkToken(token, ["teacher"]).then(() => {
				return this.mainDb.connection.query(
					"SELECT * FROM user_data " +
					"WHERE id = ?;",
					[userId]).then(sendUser);
				});
			} else {
			return this.mainDb.connection.query(
				"SELECT * FROM user_data " +
				"WHERE id IN " +
				"(SELECT id FROM loggedin " +
				"WHERE token = ?);",
				[token]).then(sendUser);
		}
	}

	async getEnrollments(token) {
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
			"WHERE enrollment.studentId = " +
			"	 (SELECT id " +
			"		FROM loggedin " +
			"		WHERE token = ?) ",
			[token]).then(async (enrollments) => {
				if (enrollments.length > 0) {
					return enrollments;
				} else {
					await this.mainDb.checkToken(token, ["student"]);
					return [];
				}
			});
	}

	async setUser(token, data) {
		if (data.userId == null) {
			await this.mainDb.checkToken(token, ["teacher", "student"]);
		} else {
			await this.mainDb.checkToken(token, ["teacher"]);
		}

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
			"WHERE id IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?)",
			[data.preferedEmail, data.profile, data.phoneNumber, token]);
	}

	async addUserEnrollment(token, groupId) {
		return this.mainDb.checkToken(token, ["student"]).then(() => this.mainDb.connection.query(
			"INSERT INTO enrollment " +
			"(studentId,groupId) VALUES" +
			"((SELECT id FROM loggedin WHERE token = ?) ,?)",
			[token, groupId]
		));
	}

	async removeUserEnrollment(token, groupId) {
		return this.mainDb.connection.query(
			"DELETE FROM enrollment " +
			"WHERE studentId IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?) AND groupId = ?",
			[token, groupId]
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
