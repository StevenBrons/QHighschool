
class SubjectDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getSubjects() {
		return this.mainDb.connection.query("SELECT * FROM subject;");
	}
	
	async getSubject(body) {
		if (body.subjectId >= 0) {
			return this.mainDb.connection.query("SELECT * FROM subject WHERE id = ?", [body.subjectId]).then(subjects => {
				if (subjects.length === 1) {
					return subjects[0];
				}
				throw new Error("subjectId is invalid");
			});
		} else {
			throw new Error("subjectId must be a number");
		}
	}

}

module.exports = SubjectDB;
