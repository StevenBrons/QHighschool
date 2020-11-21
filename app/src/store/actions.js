import filter from "lodash/filter"
import $ from "jquery";
import keyBy from "lodash/keyBy"
import map from "lodash/map"

function apiErrorHandler(endpoint, dispatch) {
	return function handleError(error) {
		const responseJSON = error.responseJSON;
		if (endpoint !== "user/self") {
			dispatch({
				type: "ADD_NOTIFICATION",
				notification: {
					id: Math.random(),
					priority: "high",
					type: "bar",
					message: responseJSON && responseJSON.error ? responseJSON.error : "Er is iets mis gegaan",
					scope: ".",
				}
			});
		}
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
			console.error(`Duplicate api call: ${method} ${endpoint}`);
		}
	};
	dispatch({
		...f,
		type: "HAS_FETCHED",
	});

	return $.ajax({
		url: "/api/" + endpoint,
		type: method,
		data: {
			...data,
			secureLogin: getState().secureLogin
		},
		dataType: "json",
	}).then((list) => {
		if (method === "put" || method === "patch" || method === "delete") {
			dispatch({
				type: "ADD_NOTIFICATION",
				notification: {
					id: Math.random(),
					priority: "low",
					type: "bar",
					message: "Opgeslagen",
					scope: "",
				}
			});
		}
		return (Array.isArray(list) && forceArray !== true) ? keyBy(list, "id") : list
	}).catch(apiErrorHandler(endpoint, dispatch));
}


export function getSubjects() {
	return (dispatch, getState) => {
		fetchData("subject/list", "get", null, dispatch, getState)
			.then((subjects) => {
				dispatch({
					type: "CHANGE_SUBJECTS",
					subjects,
				});
			}).catch(() => { });
	}
}

export function setAlias(userId) {
	return (dispatch, getState) => {
		fetchData("function/alias", "post", { userId }, dispatch, getState)
			.then(() => {
				document.location.reload();
			})
	}
}

export function switchRole(newRole) {
	return (dispatch, getState) => {
		fetchData("function/switchRole", "post", { newRole }, dispatch, getState)
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
			}).catch(() => { });
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
			}).catch(() => { });
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
			}).catch(() => { });
	}
}

function testIE(dispatch) {
	if (/MSIE|Trident/.test(window.navigator.userAgent)) {
		dispatch({
			type: "ADD_NOTIFICATION",
			notification: {
				id: Math.random(),
				priority: "high",
				type: "bar",
				message: "Deze website ondersteunt Internet Explorer niet. Gebruik een moderne browser zoals Firefox of Chrome",
				sticky: true,
				scope: "",
			}
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
				testIE(dispatch);
				dispatch({
					type: "SET_SELF",
					user,
				});
				dispatch(removeNotification(notification));
			}).catch((error) => {
				testIE(dispatch);
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
export function setFullUser(user) {
	return (dispatch, getState) => {
		dispatch({
			type: "CHANGE_USER",
			user,
		});
		fetchData("user/full", "patch", user, dispatch, getState);
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
			fetchData("course", "patch", newCourse, dispatch, getState);
		}
		if (JSON.stringify(oldCourseGroup) !== JSON.stringify(newCourseGroup)) {
			fetchData("group", "patch", newCourseGroup, dispatch, getState);
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
				groupId: group.id,
			}, dispatch, getState);
		}

		dispatch({
			type: "CHANGE_GROUP",
			group: group,
		});
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
			}).catch(() => { });
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
			}).catch(() => { });
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
			}).catch(() => { });
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

export function addSubject(name, description) {
	return (dispatch, getState) => {
		return fetchData("subject", "put", { name, description }, dispatch, getState)
			.then(() => {
				dispatch({
					type: "ADD_NOTIFICATION",
					notification: {
						id: Math.random(),
						priority: "low",
						type: "bar",
						message: "Vak aangemaakt, refresh om te zien",
						scope: "beheer",
					}
				});
			});
	}
}

export function addCourse(name, subjectId) {
	return (dispatch, getState) => {
		return fetchData("course", "put", { name, subjectId }, dispatch, getState)
			.then(() => {
				dispatch({
					type: "ADD_NOTIFICATION",
					notification: {
						id: Math.random(),
						priority: "low",
						type: "bar",
						message: "Module aangemaakt, refresh om te zien",
						scope: "beheer",
					}
				});
			});
	}
}

export function addGroup(courseId, userId) {
	return (dispatch, getState) => {
		return fetchData("group", "put", { courseId, mainTeacherId: userId }, dispatch, getState)
			.then(() => {
				dispatch({
					type: "ADD_NOTIFICATION",
					notification: {
						id: Math.random(),
						priority: "low",
						type: "bar",
						message: "Groep aangemaakt, refresh om te zien",
						scope: "beheer",
					}
				});
			});
	}
}


export function addParticipant(userId, groupId, participatingRole) {
	return (dispatch, getState) => {
		return fetchData("group/participants", "patch", { userId, groupId, participatingRole }, dispatch, getState)
			.then(() => {
				const index = getState().groups[groupId].enrollmentIds.indexOf(userId);
				dispatch({
					type: "CHANGE_GROUP",
					group: {
						id: groupId,
						enrollmentIds: [
							...getState().groups[groupId].enrollmentIds.slice(0, index),
							...getState().groups[groupId].enrollmentIds.slice(index + 1)
						],
					}
				});
				dispatch({
					type: "ADD_NOTIFICATION",
					notification: {
						id: Math.random(),
						priority: "low",
						type: "bar",
						message: "Deelnemer toegevoegd, refresh om te zien",
						scope: "*",
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

export function relogSecure() {
	setCookie("beforeLoginPath", window.location.pathname + window.location.search, 24);
	if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
		document.location.href = "http://localhost:26194/auth/login?secure=true";
	} else {
		document.location.href = "/auth/login?secure=true";
	}
}