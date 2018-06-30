import { User,Subject , Group} from "../lib/Data"

function apiErrorHandler(dispatch) {
	return function (error) {
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
					groups: {[groupId]:group}
				});
			}).catch(apiErrorHandler(dispatch));
		}
	}
}

export function getUser() {
	return (dispatch, getState) => {
		if (!getState().hasFetched.includes("User.getUser()")) {
			dispatch({
				type: "HAS_FETCHED",
				call: "User.getUser()"
			});
			User.getUser().then((user) => {
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
			group,
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
			User.addEnrollment(group.id).catch(apiErrorHandler(dispatch));
			dispatch({
				type: "CHANGE_ENROLLMENTS",
				action: "ADD",
				group,
			});
		} else {
			User.removeEnrollment(group.id).catch(apiErrorHandler(dispatch));
			dispatch({
				type: "CHANGE_ENROLLMENTS",
				action: "REMOVE",
				group,
			});
		}
	}
}
