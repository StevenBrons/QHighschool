const DEFAULT_STATE = {
	userId: null,
	enrollments: null,
	enrollableGroups: null,
	subjects: null,
	groups: null,
	users: null,
	showMenu: true,
	notifications: [],
	hasFetched: [],
}

function mainReducer(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case "SET_SELF":
			return {
				...state,
				userId: action.user.id,
				role: action.user.role,
				notifications: [...state.notifications, ...action.user.notifications],
				users: {
					[action.user.id]: action.user,
				}
			};
		case "ADD_NOTIFICATION":
			return {
				...state,
				notifications: [...state.notifications, action.notification],
			};
		case "REMOVE_NOTIFICATION":
			const index = state.notifications.indexOf(action.notification);
			return {
				...state,
				notifications: [
					...state.notifications.slice(0, index),
					...state.notifications.slice(index + 1)
				],
			};
		case "CHANGE_USERS":
			return { ...state, users: { ...action.users, ...state.users } };
		case "CHANGE_USER":
			if (state.users == null) {
				return {
					...state,
					users: {
						...state.user,
						[action.user.id]: action.user,
					}
				};
			}
			return {
				...state,
				users: {
					...state.users,
					[action.user.id]: {
						...state.users[action.user.id],
						...action.user
					}
				}
			};
		case "TOGGLE_MENU":
			if (action.menuState != null) {
				return { ...state, showMenu: action.menuState };
			} else {
				return { ...state, showMenu: !state.showMenu };
			}
		case "HAS_FETCHED":
			return { ...state, hasFetched: [...state.hasFetched, action.call] };
		case "CHANGE_ENROLLABLE_GROUPS":
			return { ...state, enrollableGroups: action.enrollableGroups };
		case "CHANGE_GROUPS":
			return { ...state, groups: { ...state.groups, ...action.groups } };
		case "CHANGE_GROUP":
			return {
				...state, groups: {
					[action.group.id]: {
						...state.groups[action.group.id], ...action.group
					}
				}
			};
		case "CHANGE_PARTICIPATING_GROUPS":
			return {
				...state, users: {
					...state.users,
					[action.userId]: {
						...state.users[action.userId],
						participatingGroupsIds: [
							...state.users[action.userId].participatingGroupsIds || [],
							...action.participatingGroupsIds,
						]
					}
				}
			};
		case "CHANGE_SUBJECTS":
			return { ...state, subjects: { ...state.subjects, ...action.subjects } };
		case "CHANGE_ENROLLMENTS":
			if (action.action === "ADD") {
				return {
					...state, users: {
						...state.users,
						[state.userId]: {
							...state.users[state.userId],
							enrollmentIds: (state.users[state.userId].enrollmentIds || []).concat(action.groupId)
						}
					}
				}
			}
			if (action.action === "REMOVE") {
				const index = state.users[state.userId].enrollmentIds.indexOf(action.groupId);
				return {
					...state, users: {
						...state.users,
						[state.userId]: {
							...state.users[state.userId],
							enrollmentIds: [
								...state.users[state.userId].enrollmentIds.slice(0, index),
								...state.users[state.userId].enrollmentIds.slice(index + 1),
							]
						}
					}
				}
			}
			return {
				...state, users: {
					...state.users,
					[state.userId]: {
						...state.users[state.userId],
						enrollmentIds: action.enrollmentIds,
					}
				}
			}
		default:
			return state;
	}
}


export default mainReducer;