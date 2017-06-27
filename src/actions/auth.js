export const signInAnonymously = () => ({
  type: "SIGN_IN_ANONYMOUSLY"
});

export const setAnonymous = payload => ({
  type: "AUTH_SET_ANONYMOUS",
  payload
});

export const setVerified = payload => ({
  type: "AUTH_SET_VERIFIED",
  payload
});

export const setId = payload => ({
  type: "AUTH_SET_ID",
  payload
});

export const setLoggedIn = payload => ({
  type: "AUTH_SET_LOGGED_IN",
  payload
});
