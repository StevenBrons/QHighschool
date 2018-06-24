import $ from "jquery";

class Data {
	constructor() {
		this.url = "http://213.127.243.178:26194/api/";
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
		});
	}

	async getChoices() {
		return $.ajax({
			url: this.getUrl() + "/choices",
			type: "get",
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
			headers:{"userid":this.token},
			dataType: "json",
		});
	}

	async setUser(newUser) {
		return $.ajax({
			url: this.getUrl(),
			type: "post",
			data: newUser,
			headers:{"userid":this.token},
			dataType: "json",
		});
	}

	async getChoices() {
		return $.ajax({
			url: this.getUrl() + "/choices/list",
			type: "get",
			headers:{"userid":this.token},
			dataType: "json",
		});
	}

	async addChoice(courseId) {
		return $.ajax({
			url: this.getUrl() + "/choices/add",
			type: "post",
			data: {
				courseId:courseId,
			},
			headers:{"userid":this.token},
			dataType: "json",
		});
	}

	async removeChoice(courseId) {
		return $.ajax({
			url: this.getUrl() + "/choices/remove",
			type: "post",
			data: {
				courseId:courseId,
			},
			headers:{"userid":this.token},
			dataType: "json",
		});
	}
}

const User = Data.User = new UserClass();
const Course = Data.Course = new CourseClass();
const Subject = Data.Subject = new SubjectClass();

const d = new Data();
export default d;
export { User,Course,Subject }