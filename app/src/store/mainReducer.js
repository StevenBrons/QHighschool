import usersReducer from "./usersReducer";
import groupsReducer from "./groupsReducer";

const DEFAULT_STATE = {
  currentPeriod: 1,
  enrollmentPeriod: 2,
  schoolYear: "2020/2021",
  possibleYears: generateYears("2020/2021"),

  userId: null,
  enrollableGroups: null,
  subjects: null,
  groups: null,
  users: null,
  showMenu: true,
  notifications: [],
  hasFetched: []
};

function generateYears(currentYear) {
  const FIRST_YEAR = 2016;
  const yearOffset = 5;
  const yearMax = currentYear.split("/")[0] + yearOffset;
  let years = [];
  for (let i = firstYear; i < yearMax; i++) {
    years.push(i + "/" + (i+1))
  }
  return years;
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
          ...state.users
        }
      };
    case "SET_SECURE_LOGIN":
      return {
        ...state,
        secureLogin: action.secureLogin
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [...state.notifications, action.notification]
      };
    case "REMOVE_NOTIFICATION":
      const index = state.notifications.indexOf(action.notification);
      return {
        ...state,
        notifications: [
          ...state.notifications.slice(0, index),
          ...state.notifications.slice(index + 1)
        ]
      };
    case "TOGGLE_MENU":
      if (action.menuState != null) {
        return { ...state, showMenu: action.menuState };
      } else {
        return { ...state, showMenu: !state.showMenu };
      }
    case "HAS_FETCHED":
      return {
        ...state,
        hasFetched: [
          ...state.hasFetched,
          { call: action.call, method: action.method, data: action.data }
        ]
      };
    case "CHANGE_SUBJECTS":
      return { ...state, subjects: { ...state.subjects, ...action.subjects } };
    default:
      return {
        ...state,
        users: usersReducer(state.users, action),
        groups: groupsReducer(state.groups, action)
      };
  }
}

export default mainReducer;
