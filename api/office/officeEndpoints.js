const connection = require("./graphConnection");
const { office365 } = require('../private/keys');
const groupDb = require("../database/GroupDB");
const userDb = require("../database/UserDB");
const schedule = require("../lib/schedule");

exports.updateClass = async (groupId) => {
	const group = await groupDb.getGroup(groupId);
	if (!schedule.shouldBeSynced(group)) return "NO_SYNC";
	if (!group.graphId) return createClass(groupId);

	return connection.api("groups/" + group.graphId)
		.patch(getMSGroupOptionsFromGroup(group))
		.catch(() => {
			console.error("Team not found");
		});
}

// Normal created group
// Api created group   NEW 4a65e346-5d8b-41de-bc05-1f82e3bb89ab OLD ac6db7b8-ee9d-4c1f-95ed-64f5e866facf

connection.getAccessToken().then(console.log).then(async () => {
	// const testGroup = await groupDb.getGroup("80");
	// // const G = await this.getAllClasses();
	// // G.map((g) => {
	// // 	console.log(g.id + " " + g.displayName);
	// // });
	// let l = "75ac4f83-014b-4e8e-ad6f-f587575014ee";
	// await connection.api(`groups/${l}/team`)
	// 	.put(getMSTeamOptionsFromGroup(testGroup));
});

exports.getAllClasses = async (link = "https://graph.microsoft.com/v1.0/groups") => {
	const obj = await connection.api(link.substring(33)).get();
	let groups = obj.value;
	if (obj["@odata.nextLink"] != null) {
		groups = groups.concat(await this.getAllClasses(obj["@odata.nextLink"]));
	}
	return groups;
}


exports.syncAllParticipants = async (group) => {
	const members = await this.getMemberList(group);
	const memberEmails = members.map(({ email }) => email);
	const participants = await groupDb.getParticipants(group.id, true);
	const participantEmails = participants.map(({ email }) => email);
	const toBeAdded = participants.filter(({ email }) => {
		return memberEmails.indexOf(email) == -1;
	});
	const toBeRemoved = members.filter(({ email }) => {
		return participantEmails.indexOf(email) === -1 &&
			!(email === "Q-Highschool@quadraam.nl" || email === "Qhighschool@quadraam.nl");
	});
	if (toBeAdded.length > 0) {
		console.log("Adding members to team of group " + group.id);
		console.log(toBeAdded.map(({ email }) => email));
	}
	if (toBeRemoved.length > 0) {
		console.log("Remove members to team of group " + group.id);
		console.log(toBeRemoved.map(({ email }) => email))
	}
	await toBeAdded.map(({ participatingRole, email }) => addParticipant(group.graphId, email, participatingRole));
	await toBeRemoved.map(({ id, role }) => removeParticipant(group.graphId, id, role));
}

exports.getMemberList = async (group) => {
	if (!schedule.shouldBeSynced(group)) return "NO_SYNC";
	const graphId = group.graphId;
	let memberList = (await connection.api(`groups/${graphId}/members`).get()).value;
	let teacherList = (await connection.api(`groups/${graphId}/owners`).get()).value;
	memberList = memberList.map(member => { return { ...member, role: "student" } });
	teacherList = teacherList.map(member => { return { ...member, role: "teacher" } });
	return memberList.concat(teacherList).map(({ id, role, displayName, userPrincipalName }) => {
		return { id, role, displayName, email: userPrincipalName };
	})
}


exports.addParticipantByUserId = async (userId, groupId, participatingRole) => {
	const graphId = await getGraphIdOrCreate(groupId);
	const upn = (await userDb.getUser(userId)).email;
	return addParticipant(graphId, upn, participatingRole);
}

async function addParticipant(graphId, upn, participatingRole) {
	const role = participatingRole === "teacher" ? "owners" : "members";
	return connection.api(`groups/${graphId}/${role}/$ref`)
		.post({ "@odata.id": `https://graph.microsoft.com/v1.0/users/${upn}` })
		.catch(() => {
			console.error("No Office account found for user " + upn);
		});
}

async function removeParticipant(graphId, graphUserId, participatingRole) {
	const role = participatingRole === "teacher" ? "owners" : "members";
	return connection.api(`groups/${graphId}/${role}/${graphUserId}/$ref`)
		.delete();
}


function sanitizeText(text) {
	if (text == null || text == "") {
		return "-";
	}
	const MAX_LENGTH = 400;
	return text.replace(/[^a-zA-Z0-9 \-#\.\?\!\(\)\[\]]/g, "").substring(0, MAX_LENGTH);;
}

function getSmallYear(schoolYear) {
	return schoolYear.replace(/^20/, "").replace(/\/20/, "");
}

function __getClassDataFromGroup(group) {
	const displayGroupId = "#G" + group.id.padStart(4, "0");
	let mailNickname = group.courseName + displayGroupId;
	mailNickname = mailNickname.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
	mailNickname = mailNickname.replace(/ +/g, "");
	mailNickname = mailNickname.replace(/[^a-zA-Z0-9 \-#]/g, "");
	mailNickname = process.env.NODE_ENV ? mailNickname : "DeleteMe" + Math.floor(Math.random() * 99999);
	const year = getSmallYear(group.schoolYear);
	// return {
	// 	description: sanitizeText(group.courseDescription),
	// 	displayName: sanitizeText(`QH ${group.subjectAbbreviation} ${group.courseName} (BLOK ${group.period} - ${year})`),
	// 	mailNickname,
	// 	classCode: displayGroupId,
	// 	externalId: group.id + "",
	// 	externalName: `${group.courseName}`,
	// }
}

function getMSTeamOptionsFromGroup(group) {
	return {};
}

function getMSGroupOptionsFromGroup(group) {
	const displayGroupId = "#G" + group.id.padStart(4, "0");
	let mailNickname = group.courseName + displayGroupId;
	mailNickname = mailNickname.replace(/(?:^|\s)\S/g, a => a.toUpperCase());
	mailNickname = mailNickname.replace(/ +/g, "");
	mailNickname = mailNickname.replace(/[^a-zA-Z0-9 \-#]/g, "");
	mailNickname = process.env.NODE_ENV ? mailNickname : "DeleteMe" + Math.floor(Math.random() * 99999);
	const year = getSmallYear(group.schoolYear);
	return {
		description: sanitizeText(group.courseDescription),
		displayName: sanitizeText(`QH ${group.subjectAbbreviation} ${group.courseName} (BLOK ${group.period} - ${year})`),
		groupTypes: [
			"Unified"
		],
		mailEnabled: false,
		mailNickname,
		securityEnabled: false,
		visibility: "HiddenMembership",
	}
}

async function createClass(groupId) {
	const group = await groupDb.getGroup(groupId);
	if (!schedule.shouldBeSynced(group)) return "NO_SYNC";

	const participants = await groupDb.getParticipants(group.id, true);

	// Create MSGroup
	const msGroup = await connection.api("groups")
		.post(getMSGroupOptionsFromGroup(group));
	await groupDb.setGraphId(group.id, msGroup.id);


	// // add team to school
	// await connection.api(`education/schools/${office365.schoolId}/classes/$ref`)
	// 	.post({ "@odata.id": "https://graph.microsoft.com/v1.0/groups/" + team.id });

	// Add participants
	await addParticipant(msGroup.id, "Qhighschool@quadraam.nl", "teacher");
	await Promise.all(participants.map(p => addParticipant(msGroup.id, p.email, p.participatingRole)));

	// Create MSTeam
	setTimeout(() => {
		connection.api(`groups/${msGroup.id}/team`)
			.put(getMSTeamOptionsFromGroup(group));
	}, 60 * 1000)


	console.log("The group #G" + groupId + " is now synchronised with office teams");
	return msGroup.id;
}

async function getGraphIdOrCreate(groupId) {
	const group = await groupDb.getGroup(groupId);
	if (!schedule.shouldBeSynced(group)) return "NO_SYNC";
	if (group.graphId == null) {
		return createClass(groupId);
	}
	return group.graphId;
}
