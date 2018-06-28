import { User } from "../Data"

function apiErrorHandler(dispatch) {
	return function (error) {
		console.log(error);
		dispatch({
			type: "FATAL_ERROR",
			error,
		});
	}
}

export function getUser() {
	return (dispatch, getState) => {
		if (!getState().hasFetched.includes("User.getUser")) {
			dispatch({
				type: "HAS_FETCHED",
				call: "User.getUser"
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

export function getEnrollableGroups() {
	return (dispatch, getState) => {
		if (getState().enrollableGroups != null || getState().hasFetched.includes("User.getEnrolllableGroups")) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "User.getEnrolllableGroups"
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
		if (getState().enrollments != null || getState().hasFetched.includes("User.getEnrollments")) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "User.getEnrollments"
		});
		User.getEnrollments().then((enrollments) => {
			dispatch({
				type: "CHANGE_ENROLLMENT",
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
				type: "CHANGE_ENROLLMENT",
				action: "ADD",
				group,
			});
		} else {
			User.removeEnrollment(group.id).catch(apiErrorHandler(dispatch));
			dispatch({
				type: "CHANGE_ENROLLMENT",
				action: "REMOVE",
				group,
			});
		}
	}
}
