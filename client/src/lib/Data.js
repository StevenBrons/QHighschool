import $ from "jquery";
import keyBy from "lodash/keyBy"
import map from "lodash/map"

class Data {
	constructor() {
		if (process.env.NODE_ENV === 'production') {
			this.url = "/api/";
		} else {
			this.url = "/api/";
		}
	}

}

class CourseClass extends Data {
	getUrl() {
		return this.url + "course";
	}

	async getList() {
		return $.ajax({
			url: this.getUrl() + "/list",
			type: "get",
			dataType: "json",
		}).then((list) => keyBy(list, "id"));
	}

	async get(courseId) {
		return $.ajax({
			url: this.getUrl(),
			type: "post",
			data: {
				courseId,
			},
			dataType: "json",
		});
	}

	async setCourse(newCourse) {
		return $.ajax({
			url: this.getUrl(),
			type: "patch",
			data: newCourse,
			dataType: "json",
		});
	}

}

class GroupClass extends Data {
	getUrl() {
		return this.url + "group";
	}

	async getList() {
		return $.ajax({
			url: this.getUrl() + "/list",
			type: "get",
			dataType: "json",
		}).then((list) => keyBy(list, "id"));
	}

	async get(groupId) {
		return $.ajax({
			url: this.getUrl() + "/",
			type: "post",
			data: {
				groupId,
			},
			dataType: "json",
		});
	}

	async setGroup(groupData) {
		return $.ajax({
			url: this.getUrl() + "/",
			type: "patch",
			data: groupData,
			dataType: "json",
		});
	}

	async getEnrollments(groupId) {
		return $.ajax({
			url: this.getUrl() + "/enrollments",
			type: "post",
			data: {
				groupId,
			},
			dataType: "json",
		}).then((list) => keyBy(list, "id"));
	}

	async setPresence(presenceObjs, groupId) {
		return $.ajax({
			url: this.getUrl() + "/presence",
			type: "patch",
			data: {
				presence: JSON.stringify(map(presenceObjs, (presenceObj) => { return presenceObj })),
				groupId,
			},
			dataType: "json",
		});
	}

	async getParticipants(groupId) {
		return $.ajax({
			url: this.getUrl() + "/participants",
			type: "post",
			data: {
				groupId,
			},
			dataType: "json",
		}).then((list) => keyBy(list, "id"));
	}

	async getLessons(groupId) {
		return $.ajax({
			url: this.getUrl() + "/lessons",
			type: "post",
			data: {
				groupId,
			},
			dataType: "json",
		}).then((list) => keyBy(list, "id"));
	}

	async setLessons(lessons) {
		return $.ajax({
			url: this.getUrl() + "/lessons",
			type: "patch",
			data: {
				lessons: JSON.stringify(map(lessons, (lesson) => { return lesson })),
			},
			dataType: "json",
		});
	}

	async getEvaluations(groupId) {
		return $.ajax({
			url: this.getUrl() + "/evaluations",
			type: "post",
			data: {
				groupId,
			},
			dataType: "json",
		});
	}

	async setEvaluations(evaluations, secureLogin) {
		return $.ajax({
			url: this.getUrl() + "/evaluations",
			type: "patch",
			data: {
				evaluations: JSON.stringify(evaluations),
				secureLogin,
			},
			dataType: "json",
		});
	}

	async getPresence(groupId) {
		return $.ajax({
			url: this.getUrl() + "/presence",
			type: "post",
			data: {
				groupId,
			},
			dataType: "json",
		}).then((list) => keyBy(list, "id"));
	}

}

class SubjectClass extends Data {
	getUrl() {
		return this.url + "subject";
	}

	async getList() {
		return $.ajax({
			url: this.getUrl() + "/list",
			type: "get",
			dataType: "json",
		}).then((list) => keyBy(list, "id"));
	}

	async get(subjectId) {
		return $.ajax({
			url: this.getUrl() + "/",
			type: "post",
			data: {
				subjectId,
			},
			dataType: "json",
		});
	}

}

class UserClass extends Data {
	getUrl() {
		return this.url + "user";
	}

	async logout() {
		return $.ajax({
			url: window.location.protocol + "/auth/logout",
			type: "get",
			dataType: "json",
		});
	}

	async getSelf() {
		return $.ajax({
			url: this.getUrl() + "/self",
			type: "get",
			dataType: "json",
		});
	}

	async setUser(newUser) {
		return $.ajax({
			url: this.getUrl(),
			type: "patch",
			data: newUser,
			dataType: "json",
		});
	}

	async getParticipatingGroups() {
		return $.ajax({
			url: this.getUrl() + "/groups",
			type: "get",
			dataType: "json",
		}).then((list) => keyBy(list, "id"));
	}

	async getEnrollments() {
		return $.ajax({
			url: this.getUrl() + "/enrollments",
			type: "get",
			dataType: "json",
		}).then((list) => keyBy(list, "id"));
	}

	async addEnrollment(groupId) {
		return $.ajax({
			url: this.getUrl() + "/enrollments",
			type: "put",
			data: {
				groupId,
			},
			dataType: "json",
		});
	}

	async removeEnrollment(groupId) {
		return $.ajax({
			url: this.getUrl() + "/enrollments",
			type: "delete",
			data: {
				groupId,
			},
			dataType: "json",
		});
	}

	async getEnrolllableGroups() {
		return $.ajax({
			url: this.getUrl() + "/enrollableGroups",
			type: "get",
			dataType: "json",
		});
	}
}

const User = Data.User = new UserClass();
const Course = Data.Course = new CourseClass();
const Subject = Data.Subject = new SubjectClass();
const Group = Data.Group = new GroupClass();

const d = new Data();
export default d;
export { User, Course, Subject, Group }