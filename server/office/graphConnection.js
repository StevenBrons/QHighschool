const moment = require("moment");
const { azureADCreds } = require('../private/keys');
const rp = require('request-promise');

let oauthToken = {
	token_type: "Bearer",
	expires_in: -1,
	createdAt: moment(),
	access_token: "",
}

this.getAccessToken = async () => {
	if (!oauthToken.createdAt.isBefore(moment().add(oauthToken.expires_in - 100, "s"))) {
		var options = {
			method: 'POST',
			uri: 'https://login.microsoftonline.com/Quadraam.onmicrosoft.com/oauth2/v2.0/token',
			form: {
				client_id: azureADCreds.clientID,
				scope: "https://graph.microsoft.com/.default",
				client_secret: azureADCreds.clientSecret,
				grant_type: "client_credentials"
			},
			json: true
		};
		const res = await rp(options);
		oauthToken = {
			...res,
			createdAt: moment(),
		};
	}
	return oauthToken.access_token;
}

// this.getAccessToken().then(console.log);


this.api = (endpoint) => {
	var options = {
		uri: `https://graph.microsoft.com/v1.0/${endpoint}`,
		json: true,
	};
	async function pre() {
		options.headers = {};
		options.headers.Authorization = `Bearer ${await exports.getAccessToken()}`;
	}

	return {
		get: async () => {
			await pre();
			options.method = "GET";
			return rp(options);
		},
		post: async (body) => {
			await pre();
			options.method = "POST";
			options.body = body;
			return rp(options);
		},
		patch: async (body) => {
			await pre();
			options.method = "PATCH";
			options.body = body;
			return rp(options);
		},
		delete: async (body) => {
			await pre();
			options.method = "DELETE";
			options.body = body;
			return rp(options);
		}
	}
}