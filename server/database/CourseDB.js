
class CourseDB {
	constructor(mainDB) {
		this.mainDB = mainDB;
	}

	async getCourses() {
		return this.mainDB.connection.query("SELECT * FROM course;");
	}

}

module.exports = CourseDB;
