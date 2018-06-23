
class SubjectDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getSubjects() {
		return this.mainDb.connection.query("SELECT * FROM subject;");
	}

}

module.exports = SubjectDB;
