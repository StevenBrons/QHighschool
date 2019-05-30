const Course = require("../dec/CourseDec");
const Group = require("../dec/CourseGroupDec");
const Subject = require("../dec/SubjectDec");

exports.getCourses = async () => {
	return Course.findAll({
		include: [{ model: Subject, attributes: ["name"] }],
		raw: true,
	}).then(courses => courses.map((course) => {
		return {
			...course,
			subjectName: course["subject.name"],
			"subject.name": undefined,
		};
	}));
}

exports.getCourse = async (courseId) => {
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

exports.getCourseIdFromGroupId = async (groupId) => {
	return Group.findByPk(groupId, {
		attributes: ["id"],
		include: {
			model: Course,
			attributes: ["id"]
		}
	}).then(group => group.course.id);
}

exports.getGroupIdsOfCourse = async (courseId) => {
	return Course.findByPk(courseId, {
		attributes: [], include: [{
			model: Group,
			attributes: ["id"],
		}]
	}).then((row) => row.course_groups.map(groups => groups.id));
}

exports.addCourse = async (data) => {
	return Course.create({
		subjectId: data.subjectId,
		name: data.name,
	});
}

exports.updateCourse = async (data) => {
	return Course.findByPk(data.courseId).then((course) => {
		if (course) {
			return course.update({
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