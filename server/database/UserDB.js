class UserDB{

	constructor(mainDB) {
		this.mainDB = mainDB;
	}

	async getUser(token) {
		return this.mainDB.connection.query(
			"SELECT * FROM user " +
			"WHERE id IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?);",
			[token]).then((users) => {
				if (users.length == 1) {
					return users[0];
				} else {
					return this.mainDB.checkToken(token);
				}
			});
	}

	async getChoices(token) {
		return this.mainDB.connection.query(
			"SELECT * FROM choice " +
			"WHERE studentId IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?)",
			[token]).then(async (choices) => {
				if (choices.length > 0) {
					return choices;
				} else {
					await this.mainDB.checkToken(token);
					return [];
				}
			});
	}

	async setUser(token, data) {
		return this.connection.query(
			"UPDATE user SET preferedemail = ? " +
			"WHERE id IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?)",
			[data.preferedEmail, token]);
	}

	async setUserChoices(token, choices) {
		const _this = this;

		function checkChoice() {
			return _this.connection.query(
				"SELECT student FROM choice " +
				"WHERE student IN " +
				"(SELECT id FROM loggedin " +
				"WHERE token = ?)",
				[_this.token]);
		}

		function updateChoice() {
			return _this.connection.query(
				"UPDATE choice SET " +
				"firstchoice = ?, " +
				"secondchoice = ?, " +
				"thirdchoice = ? " +
				"WHERE student = ?"
				[_this.choices[0], _this.choices[1], _this.choices[2], _this.data[0].student]);
		}

		function createChoice() {
			return _this.connection.query(
				"INSERT INTO choice " +
				"(student,firstchoice,secondchoice,thirdchoice) VALUES ( " +
				"student = (SELECT id FROM loggedin WHERE token = ?), " +
				"firstchoice = ?, " +
				"secondchoice = ?, " +
				"thirdchoice = ?)",
				[_this.token, _this.choices[0], _this.choices[1], _this.choices[2]]);
		}

		return this.checkToken(token).then(checkChoice()).then((data) => {
			if (data != null && data[0] != null && data[0].student > 0) {
				return updateChoice();
			} else {
				return createChoice();
			}
		});
	}

}

module.exports = UserDB;
