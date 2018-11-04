const Course = require("../databaseDeclearations/CourseDec");
const Subject = require("../databaseDeclearations/SubjectDec");

class CourseDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async query(sqlString, value) {
		return this.mainDb.connection.query(sqlString, value);
	}

	async getCourses() {
		return Course.findAll({
			include: [{ model: Subject, attributes: ["name"] }]
		}).then(rows => rows.map(({ dataValues }) => {
			return {
				...dataValues,
				subjectName: dataValues.subject.name,
			};
		}));
	}

	async getCourse(courseId) {
		return Course.findById(courseId, {
			include: [{ model: Subject, attributes: ["name"] }]
		}).then(data => {
			if (data == null) {
				throw new Error("courseId \'" + courseId + "\' is invalid");
			}
			return {
				...data.dataValues,
				subjectName: data.dataValues.subject.name,
			};
		});
	}

	async addCourse(data) {
		const q1 = "INSERT INTO course (subjectId,`name`,description,foreknowledge,studyTime) VALUES (?,?,?,?,?)"
		return this.query(q1, [data.subjectId, data.name, data.description, data.foreknowledge, data.studyTime]);
	}

	async updateCourse(data) {
		const q1 = "UPDATE course SET subjectId = ?,`name` = ?,description = ?,foreknowledge = ?,studyTime = ? WHERE id = ?"
		return this.query(q1, [data.subjectId, data.name, data.description, data.foreknowledge, data.studyTime, data.courseId]);
	}

}

module.exports = CourseDB;
