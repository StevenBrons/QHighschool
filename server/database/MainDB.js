const mysql = require("promise-mysql");
const UserDB = require("./UserDB");
const SubjectDB = require("./SubjectDB");
const CourseDB = require("./CourseDB");
const GroupDB = require("./GroupDB");
const SessionDB = require("./SessionDB");

class InvalidTokenError extends Error {
	constructor(unset) {
		if (unset === true) {
			super("Token unset");
		} else {
			super("Invalid token");
		}
	}
}

class InsufficientPrivileges extends Error {
	constructor() {
		super("You have insufficient privileges to execute this action");
	}
}


class Database {

	constructor() {
		this.connect(require('../private/keys').databaseArgs);
	}

	async connect(connectionArgs) {
		this.connection = await mysql.createConnection(connectionArgs).catch((err) => {
			console.log(err);
		});
		this.course = new CourseDB(this);
		this.subject = new SubjectDB(this);
		this.user = new UserDB(this);
		this.group = new GroupDB(this);
		this.session = new SessionDB(this);
	}

	async checkToken(token, allowedRoles) {
		if (token == null || token == "") {
			return Promise.reject(new InvalidTokenError(true));
		}
		return this.connection.query(
			"SELECT user_data.role FROM loggedin " +
			"INNER JOIN user_data ON user_data.id = loggedin.id " +
			"WHERE loggedin.token = ?" ,
			[token]).then((items) => {
				if (items.length === 1) {
					if (allowedRoles.includes(items[0].role)) {
						return items[0].role;
					}else {
						throw new InsufficientPrivileges();
					}
				}
				throw new InvalidTokenError();
			});
	}

}


module.exports = new Database();
