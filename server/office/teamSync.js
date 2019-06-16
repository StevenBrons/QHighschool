const connection = require("./graphConnection");
const fs = require('fs');
const path = require("path");
const groupDb = require("../database/GroupDB");
const userDb = require("../database/UserDB");

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

exports.updateOrCreateGroup = async (group) => {
	let graphId = group.graphId;
	if (graphId == null || graphId == "") {
		graphId = await this._createGroup(group);
		await this._createTeam(graphId, group);
	} else {
		await this._updateGroup(group);
	}
}

exports.addParticipant = async (groupGraphId, userId, participatingRole) => {
	const userGraphId = userDb.getGraphIdByUserId(userId);
	if (userGraphId == null) return;
	if (participatingRole == "teacher") {
		console.log(userGraphId);
		return this._addOwner(groupGraphId, userGraphId).catch(e => {
			console.log(e);
		});
	} else {
		return this._addMember(groupGraphId, userGraphId);
	}
}

exports.removeParticipant = async (groupGraphId, userId, participatingRole) => {
	const userGraphId = userDb.getGraphIdByUserId(userId);
	if (userGraphId == null) return;
	if (participatingRole == "teacher") {
		return this._removeOwner(groupGraphId, userGraphId);
	} else {
		return this._removeMember(groupGraphId, userGraphId);
	}
}

exports._addOwner = async (groupGraphId, userGraphId) => {
	const directoryObject = {
		"@odata.id": "https://graph.microsoft.com/v1.0/users/" + userGraphId,
	};

	return client.api("/groups/" + groupGraphId + "/owners/$ref")
		.post({ directoryObject: directoryObject });
}

exports._addMember = async (groupGraphId, userGraphId) => {
}

exports._removeOwner = async (groupGraphId, userGraphId) => {
}

exports._removeMember = async (groupGraphId, userGraphId) => {
}

exports._createGroup = async (group) => {
	const participants = await groupDb.getParticipants(group.id);
	const lessons = await groupDb.getLessons(group.id);

	const c = await connection.getCreator();
	const res = await c.api('/groups')
		.version('beta')
		.post({
			...DEFAULT_GROUP,
			displayName: "QH \u200b" + group.subjectAbbreviation + " " + group.courseName + "#" + group.id,
			mailNickname: "DeleteMe" + Math.floor(Math.random() * 99999),
			description: group.courseDescription,
		});

	const graphId = res.id;
	participants.forEach(p => this.addParticipant(res.id, p.id, p.participatingRole));

	return graphId;
}

exports._updateGroup = async (group) => {
	const c = await connection.getCreator();
	const t = await c.api("/groups/" + group.graphId).version("beta").patch({
		...DEFAULT_GROUP,
		displayName: "QH \u200b" + group.subjectAbbreviation + " " + group.courseName + "#" + group.id,
		mailNickname: "DeleteMe" + Math.floor(Math.random() * 99999),
		description: group.courseDescription,
		allowExternalSenders: false,
	});
}

exports._createTeam = async (graphId, group) => {
	const c = await connection.getCreator();
	const t = await c.api("/groups/" + graphId + "/team")
		.version("beta")
		.headers({
			"Content-type": "application/json",
		})
		.put({
			...DEFAULT_TEAM,
		});
	return t;
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

exports._updateMembers = async (officeGroupId, participants) => {

}