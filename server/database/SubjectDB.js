const Subject = require("../databaseDeclearations/SubjectDec");

class SubjectDB {
	async getSubjects() {
		return Subject.findAll();
	}

	async getSubject(subjectId) {
		return Subject.findByPk(subjectId);
	}
}

module.exports = new SubjectDB();
