import { combineReducers } from "redux";
import { firebaseStateReducer } from "react-redux-firebase";
import auth from "./auth";

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  auth
});

export default rootReducer;
