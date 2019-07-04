const groupDb = require("../database/GroupDB");
const courseDb = require("../database/CourseDB");
const OEP = require("./officeEndpoints");

this.createGroup = async (group) => {
	const participants = await groupDb.getParticipants(group.id);
	const lessons = await groupDb.getLessons(group.id);

	const graphId = await OEP._createGroup(group);
	participants.map(p => this.addParticipant(group.id, p.id, p.participatingRole));
	return OEP._createTeam(graphId, group, participants, lessons);
}

this.updateCourse = async ({ id }) => {
	const groupIds = await courseDb.getGroupIdsOfCourseId(id);
	const groups = groupIds.map((id) => groupDb.getGroup(id));
	return Promise.all(groups.map(this.updateGroup));
}

this.updateGroup = async (group) => {
	return OEP._updateGroup(group);
}

this.getGraphIdOrCreate = async (groupId) => {
	const graphId = await groupDb.getGraphIdFromGroupId(groupId);
	if (graphId == null || graphId == "") {
		const group = await groupDb.getGroup(groupId);
		return this.createGroup(group);
	}
	return graphId;
}

this.updateLesson = async ({ kind, numberInBlock, subject, resence, groupId }) => {
	const graphId = OEP.getGraphIdOrCreate(groupId);
	//TODO
}

this.addParticipant = async (groupId, userId, participatingRole) => {
	const groupGraphId = this.getGraphIdOrCreate(groupId);
	const userGraphId = userDb.getGraphIdByUserId(userId);
	if (userGraphId == null) return;
	if (participatingRole === "teacher") {
		return OEP._addOwner(groupGraphId, userGraphId);
	} else {
		return OEP._addMember(groupGraphId, userGraphId);
	}
}

this.removeParticipant = async (groupId, userId, participatingRole) => {
	const groupGraphId = this.getGraphIdOrCreate(groupId);
	const userGraphId = userDb.getGraphIdByUserId(userId);
	if (userGraphId == null) return;
	if (participatingRole === "teacher") {
		return OEP._removeOwner(groupGraphId, userGraphId);
	} else {
		return OEP._removeMember(groupGraphId, userGraphId);
	}
}