import $ from "jquery";

class Data {
    constructor() {
        this.url = "http://192.168.0.70:26194/api/";
    }

}

class UserClass extends Data {
    constructor() {
        super();
    }

    getUrl() {
        return this.url + "course/list";
    }

    async getUser() {
        console.log(this.getUrl());
        $.getJSON("/test",(data) => {
            console.log(data);
            console.log("test");
        });

        $.ajax({
            url: this.getUrl(),
            type: "get",
            dataType: "json",
            success:function tets(t){
                console.log(t);
            }
        });

    }
}

const User = Data.User = new UserClass();

const d = new Data();
export default d;
export { User }