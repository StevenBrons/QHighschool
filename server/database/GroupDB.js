
class GroupDB {
	constructor(mainDb) {
		this.mainDb = mainDb;
	}

	async getGroups() {
		return this.mainDb.connection.query(
			"SELECT  " +
			"qhighschool.group.*, " +
			"qhighschool.course.name AS courseName, " +
			"qhighschool.course.description AS courseDescription, " +
			"qhighschool.subject.id AS subjectId, " +
			"qhighschool.subject.name AS subjectName, " +
			"qhighschool.subject.description AS subjectDescription, " +
			"CONCAT(qhighschool.user.firstName, ' ', qhighschool.user.lastName) AS teacherName " +
 			"FROM qhighschool.group  " +
 			"INNER JOIN qhighschool.course ON qhighschool.course.id = qhighschool.group.courseId  " +
 			"INNER JOIN qhighschool.user ON qhighschool.user.id = qhighschool.group.teacherId " +
 			"INNER JOIN qhighschool.subject ON qhighschool.subject.id = qhighschool.course.subjectId "
		);
	}

	async getGroup(body) {
		if (body.groupId >= 0) {
			return this.mainDb.connection.query(
				"SELECT  " +
				"qhighschool.group.*, " +
				"qhighschool.course.name AS courseName, " +
				"qhighschool.course.description AS courseDescription, " +
				"qhighschool.subject.name AS subjectName, " +
				"qhighschool.subject.id AS subjectId, " +
				"qhighschool.subject.description AS subjectDescription, " +
				"CONCAT(qhighschool.user.firstName, ' ', qhighschool.user.lastName) AS teacherName " +
				 "FROM qhighschool.group  " +
				 "INNER JOIN qhighschool.course ON qhighschool.course.id = qhighschool.group.courseId  " +
				 "INNER JOIN qhighschool.user ON qhighschool.user.id = qhighschool.group.teacherId " +
				 "INNER JOIN qhighschool.subject ON qhighschool.subject.id = qhighschool.course.subjectId WHERE qhighschool.group.id = ?"
				, [body.groupId]).then(courses => {
					if (courses.length === 1) {
						return courses[0];
					}
					throw new Error("groupId is invalid");
				});
		} else {
			throw new Error("groupId must be a number");
		}
	}


}

module.exports = GroupDB;
