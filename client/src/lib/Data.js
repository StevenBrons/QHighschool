import $ from "jquery";

class Data {
	constructor() {
		if (process.env.NODE_ENV === 'production') {
			this.url = "/api/";
		} else {
			this.url = "/api/";
		}
	}

}

class GroupClass extends Data {
	getUrl() {
		return this.url + "group";
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
}

class UserClass extends Data {
	getUrl() {
		return this.url + "user";
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
const Group = Data.Group = new GroupClass();

const d = new Data();
export default d;
export { User, Group }