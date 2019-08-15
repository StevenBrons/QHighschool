const connection = require("./graphConnection");
const { office365 } = require('../private/keys');
const groupDb = require("../database/GroupDB");
const userDb = require("../database/UserDB");
const schedule = require("../lib/schedule");

exports.updateClass = async (groupId) => {
	const group = await groupDb.getGroup(groupId);
	if (!schedule.shouldBeSynced(group)) return "NO_SYNC";
	if (!group.graphId) return createClass(groupId);
	return connection.api("education/classes/" + group.graphId)
		.patch(getClassDataFromGroup(group))
		.catch(console.error);
}

exports.addParticipantByUserId = async (userId, groupId, participatingRole) => {
	const graphId = await getGraphIdOrCreate(groupId);
	const upn = (await userDb.getUser(userId)).email;
	return addParticipant(upn, graphId, participatingRole);
}

// exports.deleteAllClasses = async () => {
// 	// const res = await connection.api("education/schools/" + office365.schoolId + "/classes").get();
// 	// await Promise.\all(res.value.map(team => connection.api("education/classes/" + team.id).delete()))
// 	// 	.catch(console.error);
// 	// console.error("DELETED ALL CLASSES");
// }

async function addParticipant(graphId, upn, participatingRole) {
	const role = participatingRole === "teacher" ? "teachers" : "members";
	return connection.api(`education/classes/${graphId}/${role}/$ref`)
		.post({ "@odata.id": `https://graph.microsoft.com/v1.0/education/users/${upn}` }).catch(console.error);
}

async function removeParticipant(graphId, upn, participatingRole) {
	const role = participatingRole === "teacher" ? "teachers" : "members";
	return connection.api(`education/classes/${graphId}/${role}/$ref`)
		.delete({ "@odata.id": `https://graph.microsoft.com/v1.0/education/users/${upn}` });
}
function getClassDataFromGroup(group) {
	let mailNickname = group.courseDescription + "#G${id}";
	mailNickname = mailNickname.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
	mailNickname = mailNickname.replace(/ +/g, "");
	mailNickname = process.env.NODE_ENV ? mailNickname : "DeleteMe" + Math.floor(Math.random() * 99999);
	const displayGroupId = "#G" + group.id.padStart(4, "0");
	return {
		description: group.courseDescription,
		displayName: `QH ${group.subjectAbbreviation} ${group.courseName} ${displayGroupId}`,
		mailNickname,
		classCode: displayGroupId,
		externalId: group.id + "",
		externalName: `${group.courseName}`,
	}
}

async function createClass(groupId) {
	const group = await groupDb.getGroup(groupId);
	if (!schedule.shouldBeSynced(group)) return "NO_SYNC";

	const participants = await groupDb.getParticipants(group.id, true);

	const team = await connection.api("education/classes")
		.post(getClassDataFromGroup(group));
	await groupDb.setGraphId(group.id, team.id);
	await connection.api(`education/schools/${office365.schoolId}/classes/$ref`)
		.post({ "@odata.id": "https://graph.microsoft.com/v1.0/education/classes/" + team.id });

	await this.addParticipant(team.id, "Qhighschool@quadraam.nl", "teacher");
	await Promise.all(participants.map(p => this.addParticipant(team.id, p.email, p.participatingRole)));
	return team.id;
}

async function getGraphIdOrCreate(groupId) {
	const group = await groupDb.getGroup(groupId);
	if (!schedule.shouldBeSynced(group)) return "NO_SYNC";
	if (group.graphId == null) {
		return createClass(groupId);
	}
	return group.graphId;
}
