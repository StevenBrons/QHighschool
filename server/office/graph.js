const graph = require('@microsoft/microsoft-graph-client');

const groupSync = require("./groupSync");

let mainAccessToken;
let mainRefreshToken;
exports.mainClient;

exports.getAccessToken = async (req) => {
	if (req.user) {
		var storedToken = req.user.oauthToken;
		if (storedToken) {
			if (storedToken.expired()) {
				var newToken = await storedToken.refresh();
				req.user.oauthToken = newToken;
				return newToken.token.access_token;
			}
			return storedToken.token.access_token;
		}
	}
}

exports.getAuthenticatedClient = (accessToken) => {
	const client = graph.Client.init({
		authProvider: (done) => {
			done(null, accessToken);
		}
	});
	return client;
}

module.exports.initCreator = async (accessToken, refreshToken) => {
	mainAccessToken = accessToken;
	mainRefreshToken = refreshToken;
	exports.mainClient = exports.getAuthenticatedClient(accessToken);

	groupSync.createTeam().catch((e) => {
		console.error(e);
	});
}