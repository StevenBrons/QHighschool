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
	const course = await Course.findByPk(courseId, {
		attributes: ["id"], include: [{
			model: Group,
			attributes: ["id"],
		}]
	});
	const groups = course.course_groups;
	return groups.map(g => g.id)
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