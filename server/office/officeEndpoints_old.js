const connection = require("./graphConnection_old");

const DEFAULT_GROUP = {
	mailEnabled: false,
	securityEnabled: false,
	groupTypes: [
		"Unified"
	],
	theme: "Orange",
	visibility: "hiddenmembership"
}

const DEFAULT_TEAM = {
	memberSettings: {
		allowCreateUpdateChannels: true,
		allowDeleteChannels: false,
		allowAddRemoveApps: false,
		allowCreateUpdateRemoveTabs: true,
		allowCreateUpdateRemoveConnectors: false
	},
	guestSettings: {
		allowCreateUpdateChannels: false,
		allowDeleteChannels: false
	},
	messagingSettings: {
		allowUserEditMessages: true,
		allowUserDeleteMessages: true,
		allowOwnerDeleteMessages: true,
		allowTeamMentions: true,
		allowChannelMentions: true
	},
	funSettings: {
		allowGiphy: true,
		giphyContentRating: "moderate",
		allowStickersAndMemes: true,
		allowCustomMemes: true
	},
	// "template@odata.bind": "https://graph.microsoft.com/beta/teamsTemplates('educationClass')",
	visibility: "HiddenMembership",
	specialization: 2, //educationClass
}

exports._addOwner = async (groupGraphId, userGraphId) => {
	const directoryObject = {
		"@odata.id": "https://graph.microsoft.com/v1.0/users/" + userGraphId,
	};

	return client.api("/groups/" + groupGraphId + "/owners/$ref")
		.put({ directoryObject: directoryObject });
}

exports._addMember = async (groupGraphId, userGraphId) => {
	const directoryObject = {
		"@odata.id": "https://graph.microsoft.com/v1.0/users/" + userGraphId,
	};

	return client.api("/groups/" + groupGraphId + "/members/$ref")
		.put({ directoryObject: directoryObject });
}

exports._removeOwner = async (groupGraphId, userGraphId) => {
	return client.api(`/groups/${groupGraphId}/owners/${userGraphId}/$ref`).delete();
}

exports._removeMember = async (groupGraphId, userGraphId) => {
	return client.api(`/groups/${groupGraphId}/members/${userGraphId}/$ref`).delete();
}

exports._createGroup = async ({ id, subjectAbbreviation, courseName, courseDescription }, participants, lessons) => {
	const c = await connection.getCreator();
	const res = await c.api('/groups')
		.version('beta')
		.post({
			...DEFAULT_GROUP,
			displayName: `QH \u200b${subjectAbbreviation} ${courseName} #G${id}`,
			mailNickname: "DeleteMe" + Math.floor(Math.random() * 99999),
			description: courseDescription,
		});

	const graphId = res.id;
	return graphId;
}

exports._updateGroup = async ({ id, graphId, subjectAbbreviation, courseDescription, courseName }) => {
	const c = await connection.getCreator();
	return c.api("/groups/" + graphId).version("beta").patch({
		...DEFAULT_GROUP,
		displayName: `QH \u200b${subjectAbbreviation} ${courseName} #G${id}`,
		mailNickname: "DeleteMe" + Math.floor(Math.random() * 99999),
		description: courseDescription,
		allowExternalSenders: false,
	});
}

exports._createTeam = async (graphId) => {
	const c = await connection.getCreator();
	return c.api("/groups/" + graphId + "/team")
		.version("beta")
		.headers({ "Content-type": "application/json" })
		.put({ ...DEFAULT_TEAM });
}

exports._updateEvents = async (officeGroupId) => {
	const event = {
		subject: "Let's go for lunch",
		body: {
			contentType: "HTML",
			content: "Does mid month work for you?"
		},
		start: {
			dateTime: "2019-05-30T12:00:00",
			timeZone: "Pacific Standard Time"
		},
		end: {
			dateTime: "2019-05-30T14:00:00",
			timeZone: "Pacific Standard Time"
		},
		location: {
			displayName: "Harry's Bar"
		},
		attendees: [
			{
				emailAddress: {
					address: "adelev@contoso.onmicrosoft.com",
					name: "Adele Vance"
				},
				type: "required"
			},
			{
				emailAddress: {
					address: "qhighschool@quadraam.nl",
					name: "Adele Vance"
				},
				type: "required"
			},
		]
	};

	const c = await connection.getCreator();
	const e = await c.api("/groups/" + officeGroupId + "/events").post(event);

	return e;
}