import filter from "lodash/filter"
import $ from "jquery";
import keyBy from "lodash/keyBy"
import map from "lodash/map"

function apiErrorHandler(dispatch) {
	return function handleError({ responseJSON }) {
		dispatch({
			type: "ADD_NOTIFICATION",
			notification: {
				id: Math.random(),
				priority: "high",
				type: "bar",
				message: responseJSON.error ? responseJSON.error : "Er is iets mis gegaan",
			}
		});
		dispatch({
			type: "FATAL_ERROR",
			error: responseJSON.error,
			message: responseJSON.message,
		});
		throw responseJSON;
	}
}

export async function fetchData(endpoint, method, data, dispatch, getState, forceArray) {
	const f = {
		call: endpoint,
		method: method,
		data: data,
	}
	for (let i = 0; i < getState().hasFetched.length; i++) {
		const o = getState().hasFetched[i];
		if (o.data === f.data && o.call === f.call && o.method === f.method) {
			return Promise.reject(new Error("Duplicate api call"));
		}
	};
	dispatch({
		...f,
		type: "HAS_FETCHED",
	});
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
		fetchData("subject/list", "get", null, dispatch, getState)
			.then((subjects) => {
				dispatch({
					type: "CHANGE_SUBJECTS",
					subjects,
				});
			}).catch(() => {});
	}
}

export function setAlias(userId) {
	return (dispatch, getState) => {
		fetchData("function/alias", "post", { userId, secureLogin: getState().secureLogin }, dispatch, getState)
			.then(() => {
				document.location.reload();
			})
	}
}

export function getGroups() {
	return (dispatch, getState) => {
		fetchData("group/list", "get", null, dispatch, getState)
			.then((groups) => {
				dispatch({
					type: "CHANGE_GROUPS",
					groups,
				});
			}).catch(() => {});
	}
}

export function getParticipatingGroups() {
	return (dispatch, getState) => {
		fetchData("user/groups", "get", null, dispatch, getState)
			.then((groups) => {
				dispatch({
					type: "CHANGE_GROUPS",
					groups,
				});
			}).catch(() => {});
	}
}

export function getGroup(groupId) {
	return (dispatch, getState) => {
		fetchData("group", "post", { groupId: groupId }, dispatch, getState)
			.then((group) => {
				dispatch({
					type: "CHANGE_GROUPS",
					groups: { [groupId]: group }
				});
			});
	}
}

export function getSelf() {
	return (dispatch, getState) => {
		const notification = {
			id: -96,
			priority: "low",
			type: "bar",
			message: "Bezig met laden",
			scope: ".",
		};
		dispatch(addNotification(notification));
		fetchData("user/self", "get", null, dispatch, getState)
			.then((user) => {
				dispatch({
					type: "SET_SELF",
					user,
				});
				dispatch(removeNotification(notification));
			}).catch((error) => {
				dispatch(removeNotification(notification));
				if (error != null && error.error === "Authentication Error") {
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

export function setUser(user) {
	return (dispatch, getState) => {
		dispatch({
			type: "CHANGE_USER",
			user,
		});
		fetchData("user", "patch", user, dispatch, getState);
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
		fetchData("group/userStatus", "patch", { lessonId: lessonId, userStatus: userStatus }, dispatch, getState);
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
			fetchData("course/", "patch", newCourse, dispatch, getState);
		}
		if (JSON.stringify(oldCourseGroup) !== JSON.stringify(newCourseGroup)) {
			fetchData("group/", "patch", newCourseGroup, dispatch, getState);
		}

		if (JSON.stringify(oldPresence) !== JSON.stringify(newPresence)) {
			const changedPresenceObjs = filter(newPresence, (presence) => {
				return JSON.stringify(presence) !== JSON.stringify(oldPresence[presence.id]);
			});
			fetchData("group/presence", "patch",
				{
					presence: JSON.stringify(map(changedPresenceObjs, (changedPresenceObjs) => { return changedPresenceObjs })),
					groupId: group.id
				}, dispatch, getState);
		}

		if (newLessons != null && JSON.stringify(oldLessons) !== JSON.stringify(newLessons)) {
			fetchData("group/lessons", "patch", { lessons: JSON.stringify(map(newLessons, (lesson) => { return lesson })), }, dispatch, getState);
		}

		if (JSON.stringify(oldEvaluations) !== JSON.stringify(newEvaluations)) {
			let changedEvaluations = [];
			for (let i = 0; i < newEvaluations.length; i++) {
				const evaluation = newEvaluations[i];
				if (JSON.stringify(oldEvaluations[i]) !== JSON.stringify(evaluation)) {
					changedEvaluations.push(evaluation);
				}
			}

			fetchData("group/evaluations", "patch", {
				evaluations: JSON.stringify(changedEvaluations),
				secureLogin: getState().secureLogin
			}, dispatch, getState);
		}

		dispatch({
			type: "CHANGE_GROUP",
			group: group,
		});
	}
}

export function getEnrollableGroups() {
	return (dispatch, getState) => {
		fetchData("user/enrollableGroups", "get", null, dispatch, getState, true)
			.then((enrollableGroups) => {
				dispatch({
					type: "CHANGE_ENROLLABLE_GROUPS",
					enrollableGroups,
				});
			}).catch(() => {});
	}
}

export function getEnrolLments() {
	return (dispatch, getState) => {
		fetchData("user/enrollments", "get", null, dispatch, getState)
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
			}).catch(() => {});
	}
}

export function getGroupEnrollments(groupId) {
	return (dispatch, getState) => {
		fetchData("group/enrollments", "post", { groupId: groupId }, dispatch, getState)
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
			}).catch(() => {});
	}
}

export function getGroupLessons(groupId) {
	return (dispatch, getState) => {
		fetchData("group/lessons", "post", { groupId: groupId }, dispatch, getState)
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
		fetchData("group/presence", "post", { groupId: groupId }, dispatch, getState)
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
		fetchData("group/participants", "post", { groupId: groupId }, dispatch, getState)
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
		fetchData("user/list", "get", null, dispatch, getState)
			.then((users) => {
				dispatch({
					type: "CHANGE_USERS",
					users,
				});
			}).catch(() => {});
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
			fetchData("user/enrollments", "put", { groupId: group.id }, dispatch, getState)
				.then(() => {
					dispatch({
						type: "CHANGE_ENROLLMENTS",
						action: "ADD",
						userId: getState().userId,
						groupId: group.id,
					});
				});
		} else {
			fetchData("user/enrollments", "delete", { groupId: group.id }, dispatch, getState)
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
		fetchData("group/evaluations", "post", { groupId }, dispatch, getState, true).then((evaluations) => {
			dispatch({
				type: "CHANGE_GROUP",
				group: {
					id: groupId,
					evaluations: evaluations,
				}
			});
		});
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