class UserDB {

	constructor(mainDb) {
		this.mainDb = mainDb;
		this.query = mainDb.connection.query;
	}

	async getSelf(userId) {
		return this.query(
			"SELECT * FROM user_data " +
			"WHERE id = ?;",
			[userId]).then(async (rows) => {
				return {
					...rows[0],
					notifications: await this.getNotifications(userId),
					participatingGroupIds: await this.getParticipatingGroupIds(userId, rows[0].role === "admin"),
				};
			});
	}

	async getUser(userId) {
		return this.query(
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
		return this.query(
			"SELECT groupId " +
			"FROM enrollment " +
			"WHERE studentId = ?",
			[userId]).then(async (rows) => {
				return Promise.all(rows.map(row => this.mainDb.group.getGroup(row.groupId)));
			});
	}

	async setUser(userId, data) {
		// if (data.preferedEmail == null || data.preferedEmail == "") {
		// 	throw new Error("The property preferedEmail is required");
		// }
		// if (data.profile == null || data.profile == "") {
		// 	throw new Error("The property profile is required");
		// }
		// if (data.phoneNumber == null || data.phoneNumber == "") {
		// 	throw new Error("The property phoneNumber is required");
		// }
		// if (data.level == null || data.level == "") {
		// 	throw new Error("The property level is required");
		// }
		// if (data.year == null || data.year == "") {
		// 	throw new Error("The property year is required");
		// }
		// const re1 = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		// if (!re1.test(data.email)) {
		// 	throw new Error("The property email does not comply with requirements");
		// }
		// const re2 = /^\+?[1-9][\d]*$/i;
		// if (!re2.test(data.year)) {
		// 	throw new Error("The property phoneNumber does not comply with requirements");
		// }
		// if (parseInt(data.year) > 6) {
		// 	throw new Error("The property year must be below or equal to 6");
		// }
		// if (parseInt(data.year) < 1) {
		// 	throw new Error("The property year must be 1 or higher");
		// }
		// const re3 = /(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)/i;
		// if (!re3.test(data.phoneNumber)) {
		// 	throw new Error("The property phoneNumber does not comply with requirements");
		// }
		return this.query(
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
		return this.query(
			"INSERT INTO enrollment " +
			"(studentId,groupId) VALUES" +
			"(? ,?)",
			[userId, groupId]
		);
	}

	async removeUserEnrollment(userId, groupId) {
		return this.query(
			"DELETE FROM enrollment " +
			"WHERE studentId = ? " +
			"AND groupId = ?",
			[userId, groupId]
		);
	}

	async getNotifications(userId) {
		return this.query("SELECT * FROM notifications WHERE userId = ?", [userId]);
	}

	async getParticipatingGroupIds(userId, admin) {
		let q1 = "SELECT groupId FROM participant WHERE userId = ?";
		if (admin) {
			q1 = "SELECT id AS groupId FROM course_group";
		}
		return this.query(q1, [userId])
			.then(rows => rows.map(row => row.groupId));
	}

	async getGroups(userId, admin) {
		let q1 = "SELECT participant.groupId FROM participant WHERE participant.userId = ?";
		if (admin) {
			q1 = "SELECT id AS groupId FROM course_group";
		}
		return this.query(q1, [userId])
			.then((rows) => {
				const groupPromises = rows.map((row) => {
					return this.mainDb.group.getGroup(row.groupId);
				});
				return Promise.all(groupPromises);
			});
	}

}

module.exports = UserDB;
