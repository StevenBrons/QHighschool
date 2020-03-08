const moment = require("moment");
const uuid = require('uuid/v4');

let secureLogins = [];
let secureTimeout = null;
let secureMode = true;

class SecureLogin {
	constructor(userId) {
		this.userId = userId;
		this.validUntil = moment().add(30, "minute");
		this.token = uuid();
		this.signed = false;
	}

	sign() {
		this.signed = true;
	}

	isValid() {
		return this.signed === true && this.validUntil.isAfter(moment());
	}
}

exports.inSecureMode = () => {
	return secureMode;
}

exports.disableSecureMode = () => {
	secureMode = false;
	console.log("Disabled secure mode");
	if (secureTimeout != null) {
		clearTimeout(secureTimeout);
	}
	secureTimeout = setTimeout(() => {
		secureMode = true;
		console.log("Enabled secure mode");
	},1000 * 60 * 30)
}

exports.removeByUserId = (userId) => {
	for (let i = secureLogins.length - 1; i >= 0; i--) {
		if (secureLogins[i].validUntil.isBefore(moment())) {
			secureLogins.splice(i, 1);
			continue;
		}
		if (secureLogins[i].userId + "" === userId + "") {
			secureLogins.splice(i, 1);
			continue;
		}
	}
}

exports.add = (userId) => {
	secureLogins.push(new SecureLogin(userId));
}

exports.isValidToken = (req, res) => {
	if (!secureMode) {
		return true;
	}
	const token = req.body.secureLogin;
	const userId = req.user.id;

	const login = secureLogins.find(login => {
		return login.token === token && login.userId + "" === userId + "";
	});
	const isValid = login != null && login.isValid();
	if (!isValid) {
		res.status(401);
		res.send({
			error: "Unauthorized: Invalid secure login",
		});
	}
	return isValid;
}

exports.getToken = (req) => {
	if (req.user == null) {
		return "";
	}
	if (!secureMode) {
		return "&secureLogin=token";
	}
	const secureLogin = secureLogins.find((login) => {
		return login.userId === req.user.id;
	});
	if (secureLogin != null && secureLogin.isValid()) {
		return "&secureLogin=" + secureLogin.token;
	} else {
		return "";
	}
}

exports.sign = (userId) => {
	secureLogins.forEach(login => {
		if (login.userId + "" === userId + "") {
			login.sign();
		}
	});
}