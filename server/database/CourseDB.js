const Course = require("../dec/CourseDec");
const Group = require("../dec/CourseGroupDec");
const Subject = require("../dec/SubjectDec");

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

	async getCourseidFromGroupId(groupId) {
		return Group.findByPK(groupId, {
			attributes: ["id"],
			include: {
				model: Course,
				attributes: ["id"]
			}
		}).then(group => group.course.id);
	}

	async getGroupIdsOfCourse(courseId) {
		return Course.findByPk(courseId, {
			attributes: [], include: [{
				model: Group,
				attributes: ["id"],
			}]
		}).then((row) => row.course_groups.map(groups => groups.id));
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
			} else {
				throw new Error("courseId is invalid");
			}
		});
	}

}

module.exports = new CourseDB();
