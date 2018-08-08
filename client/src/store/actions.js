import { User, Subject, Group } from "../lib/Data"
import keyBy from "lodash/keyBy"

function apiErrorHandler(dispatch, message) {
	return function (error) {
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
			error,
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
		if (getState().enrollments != null || getState().hasFetched.includes("User.getEnrollments()")) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "User.getEnrollments()"
		});
		User.getEnrollments().then((enrollments) => {
			dispatch({
				type: "CHANGE_ENROLLMENTS",
				enrollments,
			});
		}).catch(apiErrorHandler(dispatch));
	}
}

export function getGroupEnrollments(groupId) {
	return (dispatch, getState) => {
		if (
			getState().groups[groupId].enrollments != null ||
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
					enrollments,
				}
			});
			dispatch({
				type: "CHANGE_USERS",
				users: keyBy(enrollments, "id"),
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
		const index = getState().enrollments.map(e => e.id).indexOf(group.id);
		if (index === -1) {
			User.addEnrollment(group.id).then(() => {
				dispatch({
					type: "CHANGE_ENROLLMENTS",
					action: "ADD",
					group,
				});
			}).catch(apiErrorHandler(dispatch));
		} else {
			User.removeEnrollment(group.id).then(() => {
				dispatch({
					type: "CHANGE_ENROLLMENTS",
					action: "REMOVE",
					group,
				});
			}).catch(apiErrorHandler(dispatch));

		}
	}
}
