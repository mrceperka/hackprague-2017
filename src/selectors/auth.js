export const getState = state => state.auth;
export const getLoggedIn = state => getState(state).loggedIn;
export const getId = state => getState(state).id;
export const getVerified = state => getState(state).verified;
export const getAnonymous = state => getState(state).anonymous;
