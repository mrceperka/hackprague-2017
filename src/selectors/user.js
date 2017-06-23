export const getState = state => state.user;
export const getLoggedIn = state => getState(state).loggedIn;
export const getId = state => getState(state).id;
