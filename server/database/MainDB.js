const mysql = require("promise-mysql");
const UserDB = require("./UserDB");
const SubjectDB = require("./SubjectDB");
const CourseDB = require("./CourseDB");
const GroupDB = require("./GroupDB");
const SessionDB = require("./SessionDB");
const FunctionDB = require("./FunctionDB");

class Database {

	constructor() {
		this.connect(require('../private/keys').databaseArgs);
	}

	async connect(connectionArgs) {
		this.connection = await mysql.createConnection(connectionArgs).catch((err) => {
			console.log(err);
		}).then((e) => {
			console.log("Made connection to MySQL database");
			console.log(e);
		});
		this.course = new CourseDB(this);
		this.subject = new SubjectDB(this);
		this.user = new UserDB(this);
		this.group = new GroupDB(this);
		this.session = new SessionDB(this);
		this.function = new FunctionDB(this);
	}

}


module.exports = new Database();
