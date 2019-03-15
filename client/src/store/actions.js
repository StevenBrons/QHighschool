import { User, Group } from "../lib/Data"
import filter from "lodash/filter"
import $ from "jquery";
import keyBy from "lodash/keyBy"
import map from "lodash/map"

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

export async function fetchData(endpoint, method, data, dispatch, forceArray) {
	return $.ajax({
		url: "/api/" + endpoint,
		type: method,
		data: data,
		dataType: "json",
	}).then((list) => (Array.isArray(list) && forceArray !== true) ? keyBy(list, "id") : list)
		.catch(apiErrorHandler(dispatch));
}


export function getSubjects() {
	return (dispatch, getState) => {
		if (getState().hasFetched.indexOf("Subject.getList()") === -1) {
			dispatch({
				type: "HAS_FETCHED",
				call: "Subject.getList()"
			});
			fetchData("subject/list", "get", null, dispatch)
				.then((subjects) => {
					dispatch({
						type: "CHANGE_SUBJECTS",
						subjects,
					});
				});
		}
	}
}

export function setAlias(userId) {
	return (dispatch, getState) => {
		Function.setAlias(userId, getState().secureLogin)
			.then(() => {
				document.location.reload();
			})
			.catch(apiErrorHandler(dispatch));
	}
}

export function getGroups() {
	return (dispatch, getState) => {
		if (getState().hasFetched.indexOf("Group.getList()") === -1) {
			dispatch({
				type: "HAS_FETCHED",
				call: "Group.getList()"
			});
			fetchData("group/list", "get", null, dispatch)
				.then((groups) => {
					dispatch({
						type: "CHANGE_GROUPS",
						groups,
					});
				});
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
			fetchData("user/groups", "get", null, dispatch)
				.then((groups) => {
					dispatch({
						type: "CHANGE_GROUPS",
						groups,
					});
				});
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
			fetchData("group", "post", { groupId: groupId }, dispatch)
				.then((group) => {
					dispatch({
						type: "CHANGE_GROUPS",
						groups: { [groupId]: group }
					});
				});
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
			fetchData("user/self", "get", null, dispatch)
				.then((user) => {
					dispatch({
						type: "SET_SELF",
						user,
					});
					dispatch(removeNotification(notification));
				}).catch((error) => {
					dispatch(removeNotification(notification));
					if (error != null && error.responseJSON != null && error.responseJSON.error === "Authentication Error") {
						if (window.location.pathname !== "/login") {
							setCookie("beforeLoginPath", window.location.pathname + window.location.search, 24);
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

export function setUser(user) {
	return (dispatch, getState) => {
		dispatch({
			type: "CHANGE_USER",
			user,
		});
		fetchData("user", "patch", user, dispatch);
	}
}

export function setPresenceUserStatus(lessonId, userStatus, groupId) {
	return (dispatch, getState) => {
		dispatch({
			type: "CHANGE_PRESENCE_USER_STATUS",
			lessonId,
			userStatus,
			groupId,
		});
		fetchData("group/userStatus", "patch", {lessonId: lessonId, userStatus: userStatus}, dispatch);
		//WERKT NIET!
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

		const oldEvaluations = getState().groups[group.id].evaluations;
		const newEvaluations = group.evaluations;

		if (JSON.stringify(oldCourse) !== JSON.stringify(newCourse)) {
			fetchData("course/", "patch", {newCourse: newCourse}, dispatch);
		}
		if (JSON.stringify(oldCourseGroup) !== JSON.stringify(newCourseGroup)) {
			fetchData("group/", "patch", {groupData: newCourseGroup}, dispatch);
		}

		if (JSON.stringify(oldPresence) !== JSON.stringify(newPresence)) {
			const changedPresenceObjs = filter(newPresence, (presence) => {
				return JSON.stringify(presence) !== JSON.stringify(oldPresence[presence.id]);
			});
			fetchData("group/presence", "patch", 
			{presence: JSON.stringify(map(changedPresenceObjs, (changedPresenceObjs) => { return changedPresenceObjs })),
			groupId: group.id}, dispatch);
		}

		if (newLessons != null && JSON.stringify(oldLessons) !== JSON.stringify(newLessons)) {
			fetchData("group/lessons", "patch", {lessons: JSON.stringify(map(newLessons, (lesson) => { return lesson })),}, dispatch);
		}

		if (JSON.stringify(oldEvaluations) !== JSON.stringify(newEvaluations)) {
			let changedEvaluations = [];
			for (let i = 0; i < newEvaluations.length; i++) {
				const evaluation = newEvaluations[i];
				if (JSON.stringify(oldEvaluations[i]) !== JSON.stringify(evaluation)) {
					changedEvaluations.push(evaluation);
				}
			}

			fetchData("group/evaluations", "patch", {evaluations: JSON.stringify(changedEvaluations),
				secureLogin: getState().secureLogin});
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
		User.getEnrolllableGroups.then((enrollableGroups) => {
			dispatch({
				type: "CHANGE_ENROLLABLE_GROUPS",
				enrollableGroups,
			});
		});
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
		fetchData("user/enrollments", "get", null, dispatch)
			.then((enrollments) => {
				dispatch({
					type: "CHANGE_GROUPS",
					groups: enrollments,
				});
				dispatch({
					type: "CHANGE_ENROLLMENTS",
					userId: getState().userId,
					enrollmentIds: Object.keys(enrollments),
				});
			});
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
		fetchData("group/enrollments", "post", { groupId: groupId }, dispatch)
			.then((enrollments) => {
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
			});
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
		fetchData("group/lessons", "post", { groupId: groupId }, dispatch)
			.then((lessons) => {
				dispatch({
					type: "CHANGE_GROUP",
					group: {
						id: groupId,
						lessons,
					}
				});
			});
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
		fetchData("group/presence", "post", {groupId: groupId}, dispatch)
			.then((presence) => {
				dispatch({
					type: "CHANGE_GROUP",
					group: {
						id: groupId,
						presence,
					}
				});
			});
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
		fetchData("group/participants", "post", {groupId: groupId}, dispatch)
			.then((participants) => {
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
			});
	}
}

export function getAllUsers() {
	return (dispatch, getState) => {
		if (getState().hasFetched.indexOf("User.list()") !== -1) {
			return;
		}
		dispatch({
			type: "HAS_FETCHED",
			call: "User.list()"
		});
		fetchData("user/list", "get", null, dispatch)
			.then((users) => {
				dispatch({
					type: "CHANGE_USERS",
					users,
				});
			});
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

export function setSecureLogin(secureLogin) {
	return {
		type: "SET_SECURE_LOGIN",
		secureLogin,
	}
}

export function toggleEnrollment(group) {
	return (dispatch, getState) => {
		const index = getState().users[getState().userId].enrollmentIds.indexOf(group.id);
		if (index === -1) {
			fetchData("user/enrollments", "put", { groupId: group.id }, dispatch)
				.then(() => {
					dispatch({
						type: "CHANGE_ENROLLMENTS",
						action: "ADD",
						userId: getState().userId,
						groupId: group.id,
					});
				});
		} else {
			fetchData("user/enrollments", "delete", { groupId: group.id }, dispatch)
				.then(() => {
					dispatch({
						type: "CHANGE_ENROLLMENTS",
						action: "REMOVE",
						userId: getState().userId,
						groupId: group.id,
					});
				});
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

export function setCookie(cname, cvalue, exhours) {
	var d = new Date();
	d.setTime(d.getTime() + (exhours * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) === ' ')
			c = c.substring(1);
		if (c.indexOf(name) === 0)
			return c.substring(name.length, c.length);
	}
	return "";
}