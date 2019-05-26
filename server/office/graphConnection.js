const graph = require('@microsoft/microsoft-graph-client');
const moment = require('moment');
const { azureADCreds } = require('../private/keys');
var rp = require('request-promise');

let mainCreator;
exports.isConnected = () => {
	return mainCreator != null;
}

exports.getAuthenticatedClient = (accessToken) => {
	const client = graph.Client.init({
		authProvider: (done) => {
			done(null, accessToken);
		}
	});
	return client;
}

exports.initCreator = async (accessToken, refreshToken, expiresIn) => {
	mainCreator = new MainCreator(accessToken, refreshToken, expiresIn);
}

exports.test = async () => {
	const client = await mainCreator.getAuthenticatedClient().catch(e => {
		console.log(e);
	});
	const res = await client.api("/me").get().catch(e => {
		console.log(e);
	});
	console.log(res);
}

exports.getOwnDetails = async (accessToken) => {
	const client = await exports.getAuthenticatedClient(accessToken);
	const userData = await client.api("/me").get();
	return {
		email: userData.userPrincipalName,
		firstName: userData.givenName,
		lastName: userData.surname,
		displayName: userData.displayName,
		school: null,
		role: "student",
		jobTitle: userData.jobTitle,
		preferedEmail: userData.userPrincipalName,
	};
}

class MainCreator {

	constructor(accessToken, refreshToken, expiresIn) {
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.expires = moment().add(expiresIn, "seconds");
		this.oauthToken = oauth2.accessToken.create({ refresh_token: refreshToken });
	}

	async getAuthenticatedClient() {
		console.log(this.refreshToken);
		return exports.getAuthenticatedClient(await this.getAccessToken());
	}

	async getAccessToken() {

		if (this.accessToken) {
			if (this.expires.isAfter(moment().subtract(5, "seconds"))) {
				return this.accessToken;
			}
		}

		if (this.refreshToken) {
			const newTokens = await exports.refreshToken(this.refreshToken);
			this.accessToken = newTokens.access_token;
			this.refreshToken = newTokens.refresh_token;
			this.expires = moment().add(newTokens.expires_in, "seconds");
			return this.accessToken;
		}

		return null;
	}

}

exports.refreshToken = async (refresh_token) => {
	var options = {
		method: 'POST',
		uri: 'https://login.microsoftonline.com/common/oauth2/token',
		form: {
			grant_type: "refresh_token",
			refresh_token,
			client_id: azureADCreds.clientID,
			client_secret: azureADCreds.clientSecret
		},
		json: true
	};

	return rp(options);
}
