const connection = require("./graphConnection");
const fs = require('fs');
const path = require("path");

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
	visibility: 0,
	specialization: 2, //educationClass
}
exports.createGroup = async (group) => {
	const c = await connection.getCreator();
	const res = await c.api('/groups')
		.version('beta')
		.post({
			...DEFAULT_GROUP,
			displayName: "QH \u200b" + group.subjectAbbreviation + " " + group.courseName + "#" + group.id,
			mailNickname: "DeleteMe" + Math.floor(Math.random() * 99999),
			mailEnabled: false,
			description: group.courseDescription,
		});

	return res;
}

exports.createTeam = async (officeGroupId, group) => {
	const c = await connection.getCreator();
	const t = await c.api("/groups/" + officeGroupId + "/team")
		.version("beta")
		.headers({
			"Content-type": "application/json",
		})
		.put({
			...DEFAULT_TEAM,
		});
	return t;
}

exports.updateEvents = async (officeGroupId) => {
	console.log(new Date().toString());

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

exports.updateMembers = async (officeGroupId, participants) => {

}