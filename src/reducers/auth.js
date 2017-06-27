const defaultState = {
  loggedIn: false,
  id: null,
  anonymous: true,
  verified: false
};

const userReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "AUTH_SET_LOGGED_IN": {
      return { ...state, loggedIn: action.payload };
    }
    case "AUTH_SET_ID": {
      return { ...state, id: action.payload };
    }
    case "AUTH_SET_ANONYMOUS": {
      return { ...state, anonymous: action.payload };
    }
    case "AUTH_SET_VERIFIED": {
      return { ...state, verified: action.payload };
    }
    default:
      return state;
  }
};

export default userReducer;
