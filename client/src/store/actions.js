import { User, Subject, Group } from "../lib/Data"

function apiErrorHandler(dispatch, message) {
	return function handleError(error) {
		dispatch({
			type: "ADD_NOTIFICATION",
			notification: {
				id: -1,
				priority: "high",
				type: "bar",
				message: message ? message : "Er is iets mis gegaan",
			}
		});
		dispatch({
			type: "FATAL_ERROR",
			error: error.name,
			message: error.message,
		});
		throw error;
	}
}

export function getSubjects() {
	return (dispatch, getState) => {
		if (!getState().hasFetched.includes("Subject.getList()")) {
			dispatch({
				type: "HAS_FETCHED",
				call: "Subject.getList()"
			});
			Subject.getList().then((subjects) => {
				dispatch({
					type: "CHANGE_SUBJECTS",
					subjects,
				});
			}).catch(apiErrorHandler(dispatch));
		}
	}
}

export function getGroups() {
	return (dispatch, getState) => {
		if (!getState().hasFetched.includes("Group.getList()")) {
			dispatch({
				type: "HAS_FETCHED",
				call: "Group.getList()"
			});
			Group.getList().then((groups) => {
				dispatch({
					type: "CHANGE_GROUPS",
					groups,
				});
			}).catch(apiErrorHandler(dispatch));
		}
	}
}

export function getParticipatingGroups() {
	return (dispatch, getState) => {
		if (!getState().hasFetched.includes("User.getParticipatingGroups()")) {
			dispatch({
				type: "HAS_FETCHED",
				call: "User.getParticipatingGroups()"
			});
			User.getParticipatingGroups().then((groups) => {
				dispatch({
					type: "CHANGE_GROUPS",
					groups,
				});
				dispatch({
					type: "CHANGE_PARTICIPATING_GROUPS",
					userId: getState().userId,
					participatingGroupsIds: Object.keys(groups).map(id => parseInt(id,10)),
				});
			}).catch(apiErrorHandler(dispatch));
		}
	}
}

export function getGroup(groupId) {
	return (dispatch, getState) => {
		if (!getState().hasFetched.includes("Group.get(" + groupId + ")")) {
			dispatch({
				type: "HAS_FETCHED",
				call: "Group.get(" + groupId + ")",
			});
			Group.get(groupId).then((group) => {
				dispatch({
					type: "CHANGE_GROUPS",
					groups: { [groupId]: group }
				});
			}).catch(apiErrorHandler(dispatch));
		}
	}
}

export function getSelf() {
	return (dispatch, getState) => {
		if (!getState().hasFetched.includes("User.getSelf()")) {
			dispatch({
				type: "HAS_FETCHED",
				call: "User.getSelf()"
			});
			const notification = {
				id: -96,
				priority: "low",
				type: "bar",
				message: "Bezig met laden",
				scope: ".",
			};
			dispatch(addNotification(notification));
			User.getSelf().then((user) => {
				dispatch({
					type: "SET_SELF",
					user,
				});
				dispatch(removeNotification(notification));
			}).catch((error) => {
				dispatch(removeNotification(notification));
				if (error != null && error.responseJSON != null && error.responseJSON.error === "Authentication Error") {
					if (window.location.pathname !== "/login") {
						document.location.href = "/login";
					}
				} else {
					dispatch(toggleMenu(false));
					dispatch(addNotification({
						id: -1,
						priority: "high",
						type: "bar",
						message: "Kan geen verbinding met de server maken",
					}));
				}
			});
		}
	}
}

export function getUser(userId) {
	return (dispatch, getState) => {
		if (!getState().hasFetched.includes("User.getUser(" + userId + ")")) {
			dispatch({
				type: "HAS_FETCHED",
				call: "User.getUser(" + userId + ")"
			});
			User.getUser(userId).then((user) => {
				dispatch({
					type: "CHANGE_USER",
					user,
				});
			}).catch(apiErrorHandler(dispatch));
		}
	}
}

export function setUser(user) {
	return (dispatch, getState) => {
		dispatch({
			type: "CHANGE_USER",
			user,
		});
		User.setUser(user).catch(apiErrorHandler(dispatch));
	}
}

export function setGroup(group) {
	return (dispatch, getState) => {
		dispatch({
			type: "CHANGE_GROUP",
			group: group,
		});
		// TODO setGroup api call
		// User.setUser(user).catch(apiErrorHandler(dispatch));
	}
}

export function getEnrollableGroups() {
	return (dispatch, getState) => {
		if (getState().enrollableGroups != null || getState().hasFetched.includes("User.getEnrolllableGroups()")) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "User.getEnrolllableGroups()"
		});
		User.getEnrolllableGroups().then((enrollableGroups) => {
			dispatch({
				type: "CHANGE_ENROLLABLE_GROUPS",
				enrollableGroups,
			});
		}).catch(apiErrorHandler(dispatch));
	}
}

export function getEnrolLments() {
	return (dispatch, getState) => {
		if (getState().users[getState().userId].enrollmentIds != null || getState().hasFetched.includes("User.getEnrollments()")) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "User.getEnrollments()"
		});
		User.getEnrollments().then((enrollments) => {
			dispatch({
				type: "CHANGE_GROUPS",
				groups: enrollments,
			});
			dispatch({
				type: "CHANGE_ENROLLMENTS",
				userId: getState().userId,
				enrollmentIds: Object.keys(enrollments).map(id => parseInt(id,10)),
			});
		}).catch(apiErrorHandler(dispatch));
	}
}

export function getGroupEnrollments(groupId) {
	return (dispatch, getState) => {
		if (
			getState().groups[groupId].enrollmentIds != null ||
			getState().hasFetched.includes("Group.getEnrollments(" + groupId + ")")
		) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "Group.getEnrollments(" + groupId + ")"
		});
		Group.getEnrollments(groupId).then((enrollments) => {
			dispatch({
				type: "CHANGE_GROUP",
				group: {
					id: groupId,
					enrollmentIds:Object.keys(enrollments).map(id => parseInt(id,10)),
				}
			});
			dispatch({
				type: "CHANGE_USERS",
				users: enrollments,
			});
		}).catch(apiErrorHandler(dispatch));
	}
}

export function getGroupLessons(groupId) {
	return (dispatch, getState) => {
		if (
			getState().groups[groupId].lessons != null ||
			getState().hasFetched.includes("Group.getGroupLessons(" + groupId + ")")
		) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "Group.getGroupLessons(" + groupId + ")"
		});
		Group.getGroupLessons(groupId).then((lessons) => {
			dispatch({
				type: "CHANGE_GROUP",
				group: {
					id: groupId,
					lessons,
				}
			});
		}).catch(apiErrorHandler(dispatch));
	}
}

export function getGroupParticipants(groupId) {
	return (dispatch, getState) => {
		if (
			getState().groups[groupId].participantIds != null ||
			getState().hasFetched.includes("Group.getParticipants(" + groupId + ")")
		) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "Group.getParticipants(" + groupId + ")"
		});
		Group.getParticipants(groupId).then((participants) => {
			dispatch({
				type: "CHANGE_GROUP",
				group: {
					id: groupId,
					participantIds:Object.keys(participants).map(id => parseInt(id,10)),
				}
			});
			dispatch({
				type: "CHANGE_USERS",
				users: participants,
			});
		}).catch(apiErrorHandler(dispatch));
	}
}

export function addNotification(notification) {
	return {
		type: "ADD_NOTIFICATION",
		notification,
	}
}

export function removeNotification(notification) {
	return {
		type: "REMOVE_NOTIFICATION",
		notification,
	}
}

export function toggleMenu(menuState) {
	return {
		type: "TOGGLE_MENU",
		menuState,
	}
}

export function toggleEnrollment(group) {
	return (dispatch, getState) => {
		const index = getState().users[getState().userId].enrollmentIds.indexOf(group.id);
		if (index === -1) {
			User.addEnrollment(group.id).then(() => {
				dispatch({
					type: "CHANGE_ENROLLMENTS",
					action: "ADD",
					userId: getState().userId,
					groupId: group.id,
				});
			}).catch(apiErrorHandler(dispatch));
		} else {
			User.removeEnrollment(group.id).then(() => {
				dispatch({
					type: "CHANGE_ENROLLMENTS",
					action: "REMOVE",
					userId: getState().userId,
					groupId: group.id
				});
			}).catch(apiErrorHandler(dispatch));

		}
	}
}


export function getGroupEvaluations(groupId) {
	return (dispatch, getState) => {
		if (
			getState().groups[groupId].evaluations != null ||
			getState().hasFetched.includes("Group.getEvaluations(" + groupId + ")")
		) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "Group.getEvaluations(" + groupId + ")"
		});
		Group.getEvaluations(groupId).then((evaluations) => {
			dispatch({
				type: "CHANGE_GROUP",
				group: {
					id: groupId,
					evaluations:evaluations,
				}
			});
		}).catch(apiErrorHandler(dispatch));
	}
}
