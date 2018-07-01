import { getCookie } from "../lib/Cookie";

const DEFAULT_STATE = {
	userId: null,
	enrollments: null,
	enrollableGroups: null,
	subjects: null,
	groups: null,
	users: null,
	token: getCookie("token"),
	showMenu: true,
	hasFetched: [],
}

function reducer(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case "SET_TOKEN":
			return { ...state, token: action.token };
		case "SET_SELF":
			return { ...state, userId: action.userId,role:action.role };
		case "CHANGE_USERS":
			return { ...state, users: { ...state.users, ...action.users } };
		case "CHANGE_USER":
			if (state.users == null) {
				return {
					...state, users: {
						[action.user.id]: action.user,
					}
				};
			}
			return {
				...state, users: {
					[action.user.id]: {
						...state.users[action.user.id], ...action.user
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
		case "CHANGE_SUBJECTS":
			return { ...state, subjects: { ...state.subjects, ...action.subjects } };
		case "CHANGE_ENROLLMENTS":
			if (action.action === "ADD") {
				return {
					...state, enrollments: state.enrollments.concat(action.group)
				}
			}
			if (action.action === "REMOVE") {
				const index = state.enrollments.map(e => e.id).indexOf(action.group.id);
				return {
					...state, enrollments: [
						...state.enrollments.slice(0, index),
						...state.enrollments.slice(index + 1),
					]
				}
			}
			return {
				...state, enrollments: action.enrollments
			}
		default:
			return state;
	}
}


export default reducer;