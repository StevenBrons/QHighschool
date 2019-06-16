const graph = require('@microsoft/microsoft-graph-client');
const moment = require('moment');
const { azureADCreds } = require('../private/keys');
const rp = require('request-promise');
const teamSync = require('./teamSync');
const groupDb = require('../database/GroupDB');

let mainCreator;
exports.isConnected = () => {
	return mainCreator != null;
}

exports.getCreatorRaw = () => {
	return mainCreator;
}

exports.getCreator = async () => {
	if (!exports.isConnected) {
		throw new Error("Not connected");
	}
	return mainCreator.getAuthenticatedClient();
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
	const qgroup = await groupDb.getGroup(77);
	const graphId = await teamSync.updateOrCreateGroup(qgroup).catch(e => {
		console.error(e);
	});
	// const res3 = await teamSync.updateEvents(graphId).catch(e => {
	// 	console.error(e);
	// });
	// console.log(res3);
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
	}

	async getAuthenticatedClient() {
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
