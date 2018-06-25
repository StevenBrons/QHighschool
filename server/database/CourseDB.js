
class CourseDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getCourses() {
		return this.mainDb.connection.query(				
			"SELECT "  +
			"course.* ," +
			"subject.name AS subjectName," +
			"concat(user.firstName, ' ', user.lastName) AS teacherName " +
			"FROM course INNER JOIN user ON course.teacherId = user.id " +
			"INNER JOIN subject ON course.subjectId = subject.id "
		);
	}

	async getCourse(body) {
		if (body.courseId >= 0) {
			return this.mainDb.connection.query(
				"SELECT "  +
				"course.* ," +
				"subject.name AS subjectName," +
				"concat(user.firstName, ' ', user.lastName) AS teacherName " +
				"FROM course INNER JOIN user ON course.teacherId = user.id " +
				"INNER JOIN subject ON course.subjectId = subject.id " +
				"WHERE course.id = ?;"
			, [body.courseId]).then(courses => {
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
