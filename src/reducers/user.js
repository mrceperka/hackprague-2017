const defaultState = {
  loggedIn: false,
  id: null
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "USER_SET_LOGGED_IN": {
      return { ...state, loggedIn: action.payload };
    }
    case "USER_SET_ID": {
      return { ...state, id: action.payload };
    }
    default:
      return state;
  }
};

export default userReducer;
