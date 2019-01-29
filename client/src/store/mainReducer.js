import usersReducer from "./usersReducer";
import groupsReducer from "./groupsReducer";

const DEFAULT_STATE = {
	userId: null,
	enrollableGroups: null,
	currentPeriod: 2,
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
					...state.users,
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
		case "CHANGE_SUBJECTS":
			return { ...state, subjects: { ...state.subjects, ...action.subjects } };
		default:
			return {
				...state,
				users: usersReducer(state.users, action),
				groups: groupsReducer(state.groups, action),
			}
	}
}


export default mainReducer;