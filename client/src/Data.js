import $ from "jquery";
import keyBy from "lodash/keyBy"

class Data {
	constructor() {
		if (process.env.NODE_ENV === 'production') {
			this.url = "/api/";
		} else {
			this.url = "http://192.168.0.70:26194/api/";
		}
	}

	setToken(t) {
		this.token = t;
		User.token = t;
		Course.token = t;
		Subject.token = t;
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
		}).then((list) => keyBy(list,"id"));
	}

	async get(courseId) {
		return $.ajax({
			url: this.getUrl() + "/",
			type: "post",
			data: {
				courseId: courseId,
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
		}).then((list) => keyBy(list,"id"));
	}

	async get(groupId) {
		return $.ajax({
			url: this.getUrl() + "/",
			type: "post",
			data: {
				groupId: groupId,
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
		}).then((list) => keyBy(list,"id"));
	}

	async get(subjectId) {
		return $.ajax({
			url: this.getUrl() + "/",
			type: "post",
			data: {
				subjectId: subjectId,
			},
			dataType: "json",
		});
	}

}

class UserClass extends Data {
	getUrl() {
		return this.url + "user";
	}

	async getUser() {
		return $.ajax({
			url: this.getUrl(),
			type: "get",
			headers: { "token": this.token },
			dataType: "json",
		});
	}

	async setUser(newUser) {
		return $.ajax({
			url: this.getUrl(),
			type: "post",
			data: newUser,
			headers: { "token": this.token },
			dataType: "json",
		});
	}

	async getEnrollments() {
		return $.ajax({
			url: this.getUrl() + "/enrollments",
			type: "get",
			headers: { "token": this.token },
			dataType: "json",
		});
	}

	async addEnrollment(groupId) {
		return $.ajax({
			url: this.getUrl() + "/enrollments",
			type: "put",
			data: {
				groupId: groupId,
			},
			headers: { "token": this.token },
			dataType: "json",
		});
	}

	async removeEnrollment(groupId) {
		return $.ajax({
			url: this.getUrl() + "/enrollments",
			type: "delete",
			data: {
				groupId: groupId,
			},
			headers: { "token": this.token },
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
			headers: { "token": this.token },
			dataType: "json",
		}).then((groups)=> {
			this.enrollableGroups = groups;
			return groups;
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