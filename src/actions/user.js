export const createTempUser = () => ({
  type: "CREATE_TEMP_USER"
});

export const createTempUserSuccess = payload => ({
  type: "CREATE_TEMP_USER_SUCCESS",
  payload
});
export const createTempUserFail = () => ({
  type: "CREATE_TEMP_USER_FAIL"
});
