const Course = require("../databaseDeclearations/CourseDec");
const Subject = require("../databaseDeclearations/SubjectDec");

class CourseDB {

	async getCourses() {
		return Course.findAll({
			include: [{ model: Subject, attributes: ["name"] }]
		}).then(courses => courses.map((course) => {
			return {
				...course,
				subjectName: course.subject.name,
			};
		}));
	}

	async getCourse(courseId) {
		return Course.findByPk(courseId, {
			include: [{ model: Subject, attributes: ["name"] }]
		}).then(course => {
			if (course == null) {
				throw new Error("courseId \'" + courseId + "\' is invalid");
			}
			return {
				...course,
				subjectName: course.subject.name,
			};
		});
	}

	async addCourse(data) {
		return Course.create({
			subjectId: data.subjectId,
			name: data.name,
			description: data.description,
			remarks: data.remarks,
			studyTime: data.studyTime
		});
	}

	async updateCourse(data) {
		return Course.findByPk(data.courseId).then((course) => {
			if (course) {
				return course.updateAttributes({
					subjectId: data.subjectId,
					name: data.name,
					description: data.description,
					remarks: data.remarks,
					studyTime: data.studyTime
				});
			}else {
				throw new Error("courseId is invalid");
			}
		});
	}

}

module.exports = new CourseDB();
