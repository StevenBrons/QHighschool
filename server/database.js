const mysql = require("promise-mysql");

class InvalidTokenError extends Error {
	constructor(unset) {
		if (unset === true) {
			super("Token unset");
		} else {
			super("Invalid token");
		}
	}
}

class Database {
	async connect(connectionArgs) {
		this.connection = await mysql.createConnection(connectionArgs);
	}

	async getUser(token) {
		return this.connection.query(
			"SELECT * FROM user " +
			"WHERE id IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?);",
			[token]).then((users) => {
				if (users.length == 1) {
					return users[0];
				} else {
					return this.checkToken(token);
				}
			});
	}

	async checkToken(token) {
		if (token == null || token == "") {
			return Promise.reject(new InvalidTokenError(true));
		}
		return this.connection.query(
			"SELECT id FROM loggedin " +
			"WHERE token = ?",
			[token]).then((id) => {
				if (id.length !== 1) {
					throw new InvalidTokenError();
				}
			});
	}

	async getChoice(token) {
		return this.connection.query(
			"SELECT * FROM choice " +
			"WHERE student IN " +
			"(SELECT id FROM loggedin " +
			"WHERE token = ?)",
			[token]).then(async (choice) => {
				if (choice.length == 1) {
					return choice[0];
				} else {
					await this.checkToken(token);
					return null;
				}
			});
	}

	async getCourses() {
		return this.connection.query("SELECT * FROM course;");
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
				[token]);
		}

		function updateChoice() {
			return _this.connection.query(
				"UPDATE choice SET " +
				"firstchoice = ?, " +
				"secondchoice = ?, " +
				"thirdchoice = ? " +
				"WHERE student = ?"
				[choices[0], choices[1], choices[2], data[0].student]);
		}

		function createChoice() {
			return _this.connection.query(
				"INSERT INTO choice " +
				"(student,firstchoice,secondchoice,thirdchoice) VALUES ( " +
				"student = (SELECT id FROM loggedin WHERE token = ?), " +
				"firstchoice = ?, " +
				"secondchoice = ?, " +
				"thirdchoice = ?)",
				[token, choices[0], choices[1], choices[2]]);
		}

		checkChoice().then((data) => {
			if (data[0] != null && data[0].student > 0) {
				return updateChoice();
			} else {
				return _this.checkToken().then(createChoice());
			}
		});
	}
}

module.exports = new Database();
