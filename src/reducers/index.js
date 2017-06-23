import { combineReducers } from "redux";
import { firebaseStateReducer } from "react-redux-firebase";
import userReducer from "./user";

const rootReducer = combineReducers({
  firebase: firebaseStateReducer,
  user: userReducer
});

export default rootReducer;
