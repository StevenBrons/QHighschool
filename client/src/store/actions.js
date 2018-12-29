import { User, Subject, Group, Course } from "../lib/Data"
import filter from "lodash/filter"

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
		if (getState().hasFetched.indexOf("Subject.getList()") === -1) {
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
		if (getState().hasFetched.indexOf("Group.getList()") === -1) {
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
		if (getState().hasFetched.indexOf("User.getParticipatingGroups()") === -1) {
			dispatch({
				type: "HAS_FETCHED",
				call: "User.getParticipatingGroups()"
			});
			User.getParticipatingGroups().then((groups) => {
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
		if (getState().hasFetched.indexOf("Group.get(" + groupId + ")") === -1) {
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
		if (getState().hasFetched.indexOf("User.getSelf()") === -1) {
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
						setCookie("beforeLoginPath",window.location.pathname + window.location.search,1);
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
		if (getState().hasFetched.indexOf("User.getUser(" + userId + ")") === -1) {
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
		function getCourse(group) {
			return {
				courseId: group.courseId,
				subjectId: group.subjectId,
				name: group.courseName,
				description: group.courseDescription,
				studyTime: group.studyTime,
				remarks: group.remarks,
			}
		}

		function getCourseGroup(group) {
			return {
				courseId: group.courseId,
				groupId: group.id,
				day: group.day,
				schoolYear: group.schoolYear,
				enrollableFor: group.enrollableFor,
				period: group.period,
			}
		}

		const oldCourse = getCourse(getState().groups[group.id]);
		const newCourse = getCourse(group);

		const oldCourseGroup = getCourseGroup(getState().groups[group.id]);
		const newCourseGroup = getCourseGroup(group);

		const oldLessons = getState().groups[group.id].lessons;
		const newLessons = group.lessons;

		const oldPresence = getState().groups[group.id].presence;
		const newPresence = group.presence;

		if (JSON.stringify(oldCourse) !== JSON.stringify(newCourse)) {
			Course.setCourse(newCourse).catch(apiErrorHandler(dispatch));
		}
		if (JSON.stringify(oldCourseGroup) !== JSON.stringify(newCourseGroup)) {
			Group.setGroup(newCourseGroup).catch(apiErrorHandler(dispatch));
		}

		if (JSON.stringify(oldPresence) !== JSON.stringify(newPresence)) {
			const changedPresenceObjs = filter(newPresence, (presence) => {
				return JSON.stringify(presence) !== JSON.stringify(oldPresence[presence.id]);
			});
			Group.setPresence(changedPresenceObjs, group.id).catch(apiErrorHandler(dispatch));
		}

		if (newLessons != null && JSON.stringify(oldLessons) !== JSON.stringify(newLessons)) {
			Group.setLessons(newLessons).catch(apiErrorHandler(dispatch));
		}

		dispatch({
			type: "CHANGE_GROUP",
			group: group,
		});
	}
}

export function getEnrollableGroups() {
	return (dispatch, getState) => {
		if (getState().enrollableGroups != null || getState().hasFetched.indexOf("User.getEnrolllableGroups()") !== -1) {
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
		if (getState().users[getState().userId].enrollmentIds != null || getState().hasFetched.indexOf("User.getEnrollments()") !== -1) {
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
				enrollmentIds: Object.keys(enrollments),
			});
		}).catch(apiErrorHandler(dispatch));
	}
}

export function getGroupEnrollments(groupId) {
	return (dispatch, getState) => {
		if (
			getState().groups[groupId].enrollmentIds != null ||
			getState().hasFetched.indexOf("Group.getEnrollments(" + groupId + ")") !== -1
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
					enrollmentIds: Object.keys(enrollments).map(id => parseInt(id, 10)),
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
			getState().hasFetched.indexOf("Group.getLessons(" + groupId + ")") !== -1
		) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "Group.getLessons(" + groupId + ")"
		});
		Group.getLessons(groupId).then((lessons) => {
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

export function getGroupPresence(groupId) {
	return (dispatch, getState) => {
		if (
			getState().groups[groupId].presence != null ||
			getState().hasFetched.indexOf("Group.getPresence(" + groupId + ")") !== -1
		) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "Group.getPresence(" + groupId + ")"
		});
		Group.getPresence(groupId).then((presence) => {
			dispatch({
				type: "CHANGE_GROUP",
				group: {
					id: groupId,
					presence,
				}
			});
		}).catch(apiErrorHandler(dispatch));
	}
}

export function getGroupParticipants(groupId) {
	return (dispatch, getState) => {
		if (
			getState().groups[groupId].participantIds != null ||
			getState().hasFetched.indexOf("Group.getParticipants(" + groupId + ")") !== -1
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
					participantIds: Object.keys(participants).map(id => parseInt(id, 10)),
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
			getState().hasFetched.indexOf("Group.getEvaluations(" + groupId + ")") !== -1
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
					evaluations: evaluations,
				}
			});
		}).catch(apiErrorHandler(dispatch));
	}
}

export function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}