import $ from "jquery";

class Data {
    constructor() {
        this.url = "http://192.168.0.70:26194/api/";
    }

}

class UserClass extends Data {
    getUrl() {
        return this.url + "course/list";
    }

    async getUser() {
        return $.ajax({
            url: this.getUrl(),
            type: "get",
            dataType: "json",
        });
    }
}

const User = Data.User = new UserClass();

const d = new Data();
export default d;
export { User }