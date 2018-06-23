
class CourseDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getCourses() {
		return this.mainDb.connection.query("SELECT * FROM course;");
	}

}

module.exports = CourseDB;
