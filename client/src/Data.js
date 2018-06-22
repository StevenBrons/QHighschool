import $ from "jquery";

class Data {
	constructor() {
		//this.url = "http://192.168.0.70:26194/api/";
			this.url = "http://213.127.243.178:26194/api/";
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

class UserClass extends Data {
	getUrl() {
		return this.url + "user";
	}

	async getUser(token) {
		return $.ajax({
			url: this.getUrl(),
			type: "get",
			headers:{"userid":token},
			dataType: "json",
		});
	}

	async getChoices(token) {
		return $.ajax({
			url: this.getUrl() + "/choices",
			type: "get",
			headers:{"userid":token},
			dataType: "json",
		});
	}
}

const User = Data.User = new UserClass();
const Course = Data.Course = new CourseClass();

const d = new Data();
export default d;
export { User,Course }