const connection = require("./graphConnection");
const { office365 } = require('../private/keys');
const groupDb = require("../database/GroupDB");
const schedule = require("../lib/schedule");

function getMailNickName(group) {
	let mailNickname = group.courseDescription + "#G${id}";
	mailNickname = mailNickname.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
	mailNickname = mailNickname.replace(/ +/g, "");
	return process.env.NODE_ENV ? mailNickname : "DeleteMe" + Math.floor(Math.random() * 99999)
}

exports.getGraphIdOrCreate = async (groupId) => {
	const group = await groupDb.getGroup(groupId);
	if (!schedule.shouldBeSynced(group)) return "NO_SYNC";
	if (group.graphId == null) {
		return exports.createClass(group);
	}
	return group.graphId;
}

exports.updateClass = async (group) => {
	if (!schedule.shouldBeSynced(group)) return "NO_SYNC";
	return connection.api("education/classes" + group.graphId).post({
		description: group.courseDescription,
		displayName: `QH \u200b${subjectAbbreviation} ${courseName} #G${id}`,
		mailNickname: getMailNickName(group),
		classCode: `#G${group.id}`,
		externalId: group.id + "",
		externalName: `${courseName}`,
	});
}

exports.createClass = async (group) => {
	const participants = await groupDb.getParticipants(group.id, true);

	const team = await connection.api("education/classes")
		.post({
			description: group.courseDescription,
			displayName: `QH \u200b${subjectAbbreviation} ${courseName} #G${id}`,
			mailNickname: getMailNickName(group),
			classCode: `#G${group.id}`,
			externalId: group.id + "",
			externalName: `${courseName}`,
		});
	await connection.api(`education/schools/${office365.schoolId}/classes/$ref`)
		.post({ "@odata.id": "https://graph.microsoft.com/v1.0/education/classes/" + team.id });
	await Promise.all(participants.map(p => this.addParticipant(group.id, p.email, p.participatingRole)));
	await groupDb.setGraphId(group.id, team.id);
	return team.id;
}

exports.addParticipant = async (groupId, upn, participatingRole) => {
	const graphId = this.getGraphIdOrCreate(groupId);
	if (graphId === "NO_SYNC") return;
	const role = participatingRole === "teacher" ? "teacher" : "members";
	return connection.api(`/education/classes/${graphId}/${role}/$ref`)
		.post({ "@odata.id": `https://graph.microsoft.com/v1.0/education/users/${upn}` });
}

exports.removeParticipant = async (groupId, upn, participatingRole) => {
	const graphId = this.getGraphIdOrCreate(groupId);
	if (graphId === "NO_SYNC") return;
	const role = participatingRole === "teacher" ? "teacher" : "members";
	return connection.api(`/education/classes/${graphId}/${role}/$ref`)
		.delete({ "@odata.id": `https://graph.microsoft.com/v1.0/education/users/${upn}` });
}