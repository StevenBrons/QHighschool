const Course = require("../databaseDeclearations/CourseDec");
const Subject = require("../databaseDeclearations/SubjectDec");

class CourseDB {

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
		return Course.findByPrimary(courseId, {
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
		return Course.create({
			subjectId: data.subjectId,
			name: data.name,
			description: data.description,
			foreknowledge: data.foreknowledge,
			studyTime: data.studyTime
		});
	}

	async updateCourse(data) {
		return Course.findByPrimary(data.courseId).then((course) => {
			if (course) {
				return course.updateAttributes({
					subjectId: data.subjectId,
					name: data.name,
					description: data.description,
					foreknowledge: data.foreknowledge,
					studyTime: data.studyTime
				});
			}else {
				throw new Error("courseId is invalid");
			}
		});
	}

}

module.exports = new CourseDB();
