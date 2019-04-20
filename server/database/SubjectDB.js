const Subject = require("../dec/SubjectDec");

class SubjectDB {
	async getSubjects() {
		return Subject.findAll();
	}

	async getSubject(subjectId) {
		return Subject.findByPk(subjectId);
	}

	async addSubject(name, description) {
		return Subject.create({
			name,
			description,
		});
	}
}

module.exports = new SubjectDB();
