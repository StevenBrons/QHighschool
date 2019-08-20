const Subject = require("../dec/SubjectDec");

exports.getSubjects = async () => {
	return Subject.findAll();
}

exports.getSubject = async (subjectId) => {
	return Subject.findByPk(subjectId);
}

exports.addSubject = async (name, description) => {
	return Subject.create({
		name,
		description,
	});
}

