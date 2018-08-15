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
				});
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
						id: user.id,
						firstName: user.firstName,
						lastName: user.lastName,
						displayName: user.displayName,
						email: user.email,
						role: user.role,
						school: user.school,
						year: user.year,
						profile: user.profile,
						level: user.level,
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
			"WHERE enrollment.studentId = ?",
			[userId]).then(async (enrollments) => {
				if (enrollments.length > 0) {
					return enrollments;
				} else {
					return [];
				}
			});
	}

	async setUser(userId, data) {
		if (data.preferedEmail == null || data.preferedEmail == "") {
			throw new Error("The property preferedEmail is required");
		}
		if (data.profile == null || data.profile == "") {
			throw new Error("The property profile is required");
		}
		if (data.phoneNumber == null || data.phoneNumber == "") {
			throw new Error("The property phoneNumber is required");
		}
		if (data.level == null || data.level == "") {
			throw new Error("The property level is required");
		}
		if (data.year == null || data.year == "") {
			throw new Error("The property year is required");
		}
		const re1 = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		if (!re1.test(data.email)) {
			throw new Error("The property email does not comply with requirements");
		}
		const re2 = /^\+?[1-9][\d]*$/i;
		if (!re2.test(data.year)) {
			throw new Error("The property phoneNumber does not comply with requirements");
		}
		if (parseInt(data.year) > 6) {
			throw new Error("The property year must be below or equal to 6");
		}
		if (parseInt(data.year) < 1) {
			throw new Error("The property year must be 1 or higher");
		}
		const re3 = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i;
		if (!re3.test(data.phoneNumber)) {
			throw new Error("The property phoneNumber does not comply with requirements");
		}
		return this.mainDb.connection.query(
			"UPDATE user_data SET " +
			"preferedEmail = ?, " +
			"profile = ?, " +
			"phoneNumber = ?, " +
			"year = ?, " +
			"level = ? " +
			"WHERE id = ? ",
			[data.preferedEmail, data.profile, data.phoneNumber, data.year, data.level, userId]
		);
	}

	async addUserEnrollment(userId, groupId) {
		return this.mainDb.connection.query(
			"INSERT INTO enrollment " +
			"(studentId,groupId) VALUES" +
			"(? ,?)",
			[userId, groupId]
		);
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

	async getGroups(userId) {
		return this.mainDb.connection.query(
			"SELECT participant.groupId " +
			"FROM participant " +
			"WHERE participant.userId = ? ",
			[userId]
		).then(rows => {
			const groupPromises = rows.map((row) => {
				return this.mainDb.group.getGroup(row.groupId);
			});
			return Promise.all(groupPromises);
		});
	}

}

module.exports = UserDB;
