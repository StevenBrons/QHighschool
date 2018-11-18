class CourseDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async query(sqlString, value) {
		return this.mainDb.connection.query(sqlString, value);
	}

	async getCourses() {
		const q1 = "SELECT course.*,school_subject.name AS subjectName FROM course INNER JOIN school_subject ON school_subject.id = course.subjectId;";
		return this.query(q1);
	}

	async getCourse(body) {
		if (body.courseId >= 0) {
			throw new Error("courseId must be a number");
		}
		const q1 = "SELECT course.*,school_subject.name AS subjectName FROM course INNER JOIN school_subject ON school_subject.id = course.subjectId WHERE course.id = ?";
		return this.query(q1, [body.courseId])
			.then(courses => {
				if (courses.length === 1) {
					return courses[0];
				}
				throw new Error("courseId is invalid");
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
