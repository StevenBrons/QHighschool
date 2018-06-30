class UserDB{

	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getUser(token,userId) {
		if (userId != null) {
			return this.mainDb.checkToken(token,["teacher"]).then(() => {
				return this.mainDb.connection.query(
					"SELECT * FROM user " +
					"WHERE id = ?;",
					[userId]).then((users) => {
						if (users.length == 1) {
							return users[0];
						} else {
							return this.mainDb.checkToken(token,["teacher"]);
						}
					});
			});
		}else {
			return this.mainDb.connection.query(
				"SELECT * FROM user " +
				"WHERE id IN " +
				"(SELECT id FROM loggedin " +
				"WHERE token = ?);",
				[token]).then((users) => {
					if (users.length == 1) {
						return users[0];
					} else {
						return this.mainDb.checkToken(token,["student"]);
					}
				});
		}
	}

	async getEnrollments(token) {
		return this.mainDb.connection.query(
			"SELECT   " +
			"qhighschool.group.*,  " +
			"qhighschool.course.name AS courseName,  " +
			"qhighschool.course.description AS courseDescription,  " +
			"qhighschool.subject.id AS subjectId,  " +
			"qhighschool.subject.name AS subjectName,  " +
			"qhighschool.subject.description AS subjectDescription,  " +
			"CONCAT(qhighschool.user.firstName, ' ', qhighschool.user.lastName) AS teacherName  " +
			" FROM qhighschool.enrollment " +
			" INNER JOIN qhighschool.group ON qhighschool.group.id = qhighschool.enrollment.groupId   " +
			" INNER JOIN qhighschool.course ON qhighschool.course.id = qhighschool.group.courseId   " +
			" INNER JOIN qhighschool.user ON qhighschool.user.id = qhighschool.group.teacherId  " +
			" INNER JOIN qhighschool.subject ON qhighschool.subject.id = qhighschool.course.subjectId " +
			" WHERE qhighschool.enrollment.studentId = (SELECT id FROM loggedin WHERE token = ?) ",
			[token]).then(async (enrollments) => {
				if (enrollments.length > 0) {
					return enrollments;
				} else {
					await this.mainDb.checkToken(token,["student"]);
					return [];
				}
			});
	}

	async setUser(token, data) {
		await this.mainDb.checkToken(token,["student"]);

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
			"UPDATE user SET " +
			"preferedEmail = ?, " +
			"profile = ?, " +
			"phoneNumber = ? " +
			"WHERE id IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?)",
			[data.preferedEmail,data.profile,data.phoneNumber, token]);
	}

	async addUserEnrollment(token, groupId) {
		return this.mainDb.checkToken(token,["student"]).then(() => this.mainDb.connection.query(
			"INSERT INTO enrollment " + 
			"(studentId,groupId) VALUES" + 
			"((SELECT id FROM loggedin WHERE token = ?) ,?)",
			[token,groupId]
		));
	}

	async removeUserEnrollment(token, groupId) {
		return this.mainDb.connection.query(
			"DELETE FROM enrollment " + 
			"WHERE studentId IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?) AND groupId = ?",
			[token,groupId]
		);
	}

}

module.exports = UserDB;
