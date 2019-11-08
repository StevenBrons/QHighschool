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
	return addParticipant(graphId, upn, participatingRole);
}

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

function sanitizeText(text) {
	return text.replace(/[^a-zA-Z0-9 \-#\.,\?\!\(\)\[\]"']/g, "");
}

function getSmallYear(schoolYear) {
	return schoolYear.replace(/^20/, "").replace(/\/20/, "");
}

function getClassDataFromGroup(group) {
	const displayGroupId = "#G" + group.id.padStart(4, "0");
	let mailNickname = group.courseName + displayGroupId;
	mailNickname = mailNickname.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
	mailNickname = mailNickname.replace(/ +/g, "");
	mailNickname = mailNickname.replace(/[^a-zA-Z0-9 \-#]/g, "");
	mailNickname = process.env.NODE_ENV ? mailNickname : "DeleteMe" + Math.floor(Math.random() * 99999);
	const year = getSmallYear(group.schoolYear);
	return {
		description: sanitizeText(group.courseDescription),
		displayName: sanitizeText(`QH ${group.subjectAbbreviation} ${group.courseName} (BLOK ${group.period}, ${year})`),
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

	await addParticipant(team.id, "Qhighschool@quadraam.nl", "teacher");
	await Promise.all(participants.map(p => addParticipant(team.id, p.email, p.participatingRole)));

	console.log("The group #G" + groupId + " is now synchronised with office teams");
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
