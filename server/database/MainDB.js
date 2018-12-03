const mysql = require("promise-mysql");
const UserDB = require("./UserDB");
const SessionDB = require("./SessionDB");
const FunctionDB = require("./FunctionDB");

class Database {

	constructor() {
		this.connect(require('../private/keys').databaseArgs);
	}

	async connect(connectionArgs) {
		this.connection = await mysql.createConnection(connectionArgs)
			.catch((err) => {
				console.log(err);
			});
		this.user = new UserDB(this);
		this.session = new SessionDB(this);
		this.function = new FunctionDB(this);
	}

}


module.exports = new Database();
