const moment = require("moment");
const uuid = require('uuid/v4');

let secureLogins = [];

class SecureLogin {
	constructor(userId, ip) {
		this.userId = userId;
		this.validUntil = moment().add(30, "minute");
		this.token = uuid();
		this.signed = false;
		this.ip = ip;
	}

	sign() {
		this.signed = true;
	}

	isValid(ip) {
		return this.signed === true && this.validUntil.isAfter(moment()) && this.ip === ip;
	}
}

function removeByUserId(userId) {
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

function add(userId, ip) {
	secureLogins.push(new SecureLogin(userId, ip));
}

function isValidToken(req, res) {
	const token = req.body.secureLogin;
	const userId = req.user.id;
	const ip = req.connection.remoteAddress;

	const login = secureLogins.find(login => {
		return login.token === token && login.userId + "" === userId + "";
	});
	const isValid = login != null && login.isValid(ip);
	if (!isValid) {
		res.status(401);
		res.send({
			error: "Unauthorized: Invalid secure login",
		});
	}
	return isValid;
}

function getToken(req) {
	if (req.user == null) {
		return "";
	}

	const secureLogin = secureLogins.find((login) => {
		return login.userId === req.user.id;
	});

	if (secureLogin != null && secureLogin.isValid(req.connection.remoteAddress)) {
		return "&secureLogin=" + secureLogin.token;
	} else {
		return "";
	}
}

function sign(userId) {
	secureLogins.forEach(login => {
		if (login.userId + "" === userId + "") {
			login.sign();
		}
	});
}

module.exports.add = add;
module.exports.sign = sign;
module.exports.getToken = getToken;
module.exports.isValidToken = isValidToken;
module.exports.removeByUserId = removeByUserId;