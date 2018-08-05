class UserDB {

	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getUserByToken(token, groupId) {
		return this.mainDb.connection.query(
			"INSERT INTO enrollment " +
			"(studentId,groupId) VALUES" +
			"((SELECT id FROM loggedin WHERE token = ?) ,?)",
			[token, groupId]
		);
	}

	async createSessionForUser(token, groupId) {
		return this.mainDb.connection.query(
			"INSERT INTO enrollment " +
			"(studentId,groupId) VALUES" +
			"((SELECT id FROM loggedin WHERE token = ?) ,?)",
			[token, groupId]
		);
	}

	async destroySession(token, groupId) {
		return this.mainDb.connection.query(
			"INSERT INTO enrollment " +
			"(studentId,groupId) VALUES" +
			"((SELECT id FROM loggedin WHERE token = ?) ,?)",
			[token, groupId]
		);
	}

}

module.exports = UserDB;
