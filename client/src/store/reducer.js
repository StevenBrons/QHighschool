const DEFAULT_STATE = {
	user: {
	},
	enrollments: null,
	enrollableGroups: null,
	subjects:null,
	groups: null,
	showMenu: true,
	isLoggedIn: true,
	hasFetched:[],
}

function reducer(state = DEFAULT_STATE, action) {
	switch (action.type) {
		case "LOGIN":
			return { ...state, isLoggedIn: true };
		case "CHANGE_USER":
			return { ...state, user: { ...state.user, ...action.user } };
		case "TOGGLE_MENU":
			if (action.menuState != null) {
				return { ...state, showMenu: action.menuState };
			} else {
				return { ...state, showMenu: !state.showMenu };
			}
		case "HAS_FETCHED":
			return { ...state, hasFetched: [...state.hasFetched,action.call] };
		case "CHANGE_ENROLLABLE_GROUPS":
			return { ...state, enrollableGroups: action.enrollableGroups };
		case "CHANGE_GROUPS":
			return { ...state, groups: action.groups };
		case "CHANGE_GROUP":
			return { ...state, groups: [...this.state.groups,action.group] };
		case "CHANGE_SUBJECTS":
			return { ...state, subjects: action.subjects };
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