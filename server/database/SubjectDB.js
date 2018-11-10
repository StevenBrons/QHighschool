const Subject = require("../databaseDeclearations/SubjectDec");

class SubjectDB {
	async getSubjects() {
		return Subject.findAll().then((rows) => {
			return rows.map(data => data.dataValues);
		});
	}

	async getSubject(subjectId) {
		return Subject.findByPrimary(subjectId).then(data => {
			if (data == null) {
				throw new Error("subjectId \'" + subjectId + "\' is invalid");
			}
			return data.dataValues
		});
	}
}

module.exports = new SubjectDB();
