class UserDB{

	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getUser(token) {
		return this.mainDb.connection.query(
			"SELECT * FROM user " +
			"WHERE id IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?);",
			[token]).then((users) => {
				if (users.length == 1) {
					return users[0];
				} else {
					return this.mainDb.checkToken(token);
				}
			});
	}

	async getChoices(token) {
		return this.mainDb.connection.query(
			"SELECT * FROM course WHERE id IN " +
			"(SELECT (courseId) FROM choice " +
			"WHERE studentId IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?))",
			[token]).then(async (choices) => {
				if (choices.length > 0) {
					return choices;
				} else {
					await this.mainDb.checkToken(token);
					return [];
				}
			});
	}

	async setUser(token, data) {
		await this.mainDb.checkToken(token);

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

	async addUserChoice(token, courseId) {
		return this.mainDb.connection.query(
			"INSERT INTO choice " + 
			"(studentId,courseId) VALUES" + 
			"((SELECT id FROM loggedin WHERE token = ?) ,?)",
			[token,courseId]
		);
	}

	async removeUserChoice(token, courseId) {
		return this.mainDb.connection.query(
			"DELETE FROM choice " + 
			"WHERE studentId IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?) AND courseId = ?",
			[token,courseId]
		);
	}

}

module.exports = UserDB;
