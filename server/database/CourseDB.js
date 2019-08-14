const Course = require("../dec/CourseDec");
const Group = require("../dec/CourseGroupDec");
const Subject = require("../dec/SubjectDec");
const officeEndpoints = require("../office/officeEndpoints");

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

exports.getGroupIdsOfCourseId = async (courseId) => {
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
		description: "",
		remarks: "",
		studyTime: 40,
	});
}

exports.updateCourse = async ({ courseId, subjectId, name, description, remarks, studyTime }) => {
	let course = await Course.findByPk(courseId);
	if (course) {
		course = await course.update({
			subjectId,
			name,
			description,
			remarks,
			studyTime,
		});

		const groupIds = await exports.getGroupIdsOfCourseId(course.id)
		groupIds.forEach(officeEndpoints.updateClass);

		return course;
	} else {
		throw new Error("courseId is invalid");
	}
}