const Course = require("../dec/CourseDec");
const Group = require("../dec/CourseGroupDec");
const Subject = require("../dec/SubjectDec");
const teamSync = require("../office/teamSync");
const schedule = require("../lib/schedule");
const groupDb = require("./GroupDB");

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
	return Course.findByPk(data.courseId).then(async (course) => {
		if (course) {
			const course = await course.update({
				subjectId: data.subjectId,
				name: data.name,
				description: data.description,
				remarks: data.remarks,
				studyTime: data.studyTime
			});

			const groupIds = await exports.getGroupIdsOfCourse(course.id)
			let groups = await Promise.all(groupIds.map(id => groupDb.getGroup(id)));
			groups = groups.filter(g => schedule.shouldBeSynced(g));
			groups.forEach(g => teamSync.updateOrCreateGroup(g));

			return course;
		} else {
			throw new Error("courseId is invalid");
		}
	});
}