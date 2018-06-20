
const url = "213.127.243.178:3001/api/";

class Data {
    constructor() {
    }
}

class UserClass extends Data {
    constructor() {
        super();
    }
}

const User = Data.User = new UserClass();

const d = new Data();
export default d;
export {User}