
class SubjectDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async query(sqlString, value) {
		return this.mainDb.connection.query(sqlString, value);
	}

	async getSubjects() {
		return this.query("SELECT * FROM school_subject;");
	}

	async getSubject(body) {
		if (body.subjectId >= 0) {
			return this.query("SELECT * FROM school_subject WHERE id = ?", [body.subjectId])
				.then(subjects => {
					if (subjects.length === 1) {
						return subjects[0];
					}
					throw new Error("subjectId is invalid");
				})
				.catch(err => {
					console.log(err);
				});
		} else {
			throw new Error("subjectId must be a number");
		}
	}

}

module.exports = SubjectDB;
