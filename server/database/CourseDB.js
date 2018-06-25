
class CourseDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getCourses() {
		return this.mainDb.connection.query("SELECT * FROM course;");
	}

	async getCourse(body) {
		if (body.courseId >= 0) {
			return this.mainDb.connection.query("SELECT * FROM course WHERE id = ?", [body.courseId]).then(courses => {
				if (courses.length === 1) {
					return courses[0];
				}
				throw new Error("courseId is invalid");
			});
		} else {
			throw new Error("courseId must be a number");
		}
	}


}

module.exports = CourseDB;
