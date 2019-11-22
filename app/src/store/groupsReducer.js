const DEFAULT_GROUPS = {
}

function usersReducer(groups = DEFAULT_GROUPS, action) {
	switch (action.type) {
		case "CHANGE_GROUPS":
			let newGroups = { ...groups };
			for (const key in action.groups) {
				newGroups[key] = { ...newGroups[key], ...action.groups[key] };
			}
			return newGroups;
		case "CHANGE_GROUP":
			return {
				...groups,
				[action.group.id]: {
					...groups[action.group.id],
					...action.group
				}
			};
		case "CHANGE_PRESENCE_USER_STATUS":
			return {
				...groups,
				[action.groupId]: {
					...groups[action.groupId],
					lessons: {
						...groups[action.groupId].lessons,
						[action.lessonId]: {
							...groups[action.groupId].lessons[action.lessonId],
							userStatus: action.userStatus,
						}
					}
				}
			}
		default:
			return groups;
	}
}


export default usersReducer;