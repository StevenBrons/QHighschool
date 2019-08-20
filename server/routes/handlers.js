exports.handleError = function (res) {
	return function (error) {
		if (!process.env.NODE_ENV) console.error(error);
		res.status(406);
		res.send({
			error: error.message,
		});
	}
}

exports.logger = async function (data) {
	console.log(data);
	return data;
}

exports.authError = function authError(res) {
	res.status(401);
	res.send({
		error: "Unauthorized",
	});
};

exports.handleSuccess = function handleSuccess(res) {
	return function (result) {
		res.send({
			sucess: true,
		})
	}
}

exports.handleReturn = function handleReturn(res) {
	return function (result) {
		if (result == null) {
			res.send({
				sucess: true,
			})
		} else {
			res.send(result);
		}
	}
}