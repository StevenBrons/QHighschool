
class SubjectDB {
	constructor(mainDB) {
		this.mainDB = mainDB;
	}

	async getSubjects() {
		return this.mainDB.connection.query("SELECT * FROM subject;");
	}

}

module.exports = SubjectDB;
