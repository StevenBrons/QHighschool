const mysql = require("promise-mysql");
const UserDB = require("./UserDB");
const SubjectDB = require("./SubjectDB");
const CourseDB = require("./CourseDB");
const GroupDB = require("./GroupDB");

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

	constructor() {
		this.connect(require('../private/keys').databaseArgs);
	}

	async connect(connectionArgs) {
		this.connection = await mysql.createConnection(connectionArgs);
		this.course = new CourseDB(this);
		this.subject = new SubjectDB(this);
		this.user = new UserDB(this);
		this.group = new GroupDB(this);
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

}


module.exports = new Database();
