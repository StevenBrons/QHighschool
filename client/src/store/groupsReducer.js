const DEFAULT_GROUPS = {
}

function usersReducer(groups = DEFAULT_GROUPS, action) {
	switch (action.type) {
		case "CHANGE_GROUPS":
			return { ...action.groups,...groups, };
		case "CHANGE_GROUP":
			return {
					...groups,
					[action.group.id]: {
						...groups[action.group.id], 
						...action.group
					}
			};
		default:
			return groups;
	}
}


export default usersReducer;