import $ from "jquery";
import keyBy from "lodash/keyBy"

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
			url: this.getUrl() + "/",
			type: "post",
			data: {
				courseId,
			},
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

	async getEnrollments(groupId) {
		return $.ajax({
			url: this.getUrl() + "/enrollments",
			type: "post",
			data: {
				groupId,
			},
			dataType: "json",
		});
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

	async getSelf() {
		return $.ajax({
			url: this.getUrl() + "/self",
			type: "get",
			dataType: "json",
		});
	}

	async getUser(userId) {
		return $.ajax({
			url: this.getUrl(),
			type: "post",
			data: {
				userId
			},
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

	async getEnrollments() {
		return $.ajax({
			url: this.getUrl() + "/enrollments",
			type: "get",
			dataType: "json",
		});
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
		if (this.enrollableGroups != null) {
			return this.enrollableGroups;
		}
		return $.ajax({
			url: this.getUrl() + "/enrollableGroups",
			type: "get",
			dataType: "json",
		}).then((groups) => {
			this.enrollableGroups = groups;
			return groups;
		});
	}
}

const User = Data.User = new UserClass();
const Course = Data.Course = new CourseClass();
const Subject = Data.Subject = new SubjectClass();
const Group = Data.Group = new GroupClass();

User.getSelf().then((user) => {
	console.log(user);
}).catch((err) => {
	console.log(err);
});

const d = new Data();
export default d;
export { User, Course, Subject, Group }