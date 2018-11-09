const DEFAULT_USERS = {
}

function usersReducer(users = DEFAULT_USERS, action) {
	switch (action.type) {
		case "CHANGE_USERS":
			return { ...action.users, ...users };
		case "CHANGE_USER":
			return {
					...users,
					[action.user.id]: {
						...users[action.user.id],
						...action.user
					}
			};
		case "CHANGE_ENROLLMENTS":
			if (action.action === "ADD") {
				return {
						...users,
						[action.userId]: {
							...users[action.userId],
							enrollmentIds: (users[action.userId].enrollmentIds || []).concat(action.groupId)
					}
				}
			}
			if (action.action === "REMOVE") {
				const index = users[action.userId].enrollmentIds.indexOf(action.groupId);
				return {
						...users,
						[action.userId]: {
							...users[action.userId],
							enrollmentIds: [
								...users[action.userId].enrollmentIds.slice(0, index),
								...users[action.userId].enrollmentIds.slice(index + 1),
							]
						}
					}
				}
			return {
					...users,
					[action.userId]: {
						...users[action.userId],
						enrollmentIds: action.enrollmentIds,
					}
			}
		default:
			return users;
	}
}


export default usersReducer;