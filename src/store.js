import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { reactReduxFirebase } from "react-redux-firebase";
import logger from "redux-logger";

import firebaseConfig from "./config/firebase";
import rootReducer from "./reducers";

// Add redux Firebase to compose
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebaseConfig, { userProfile: "users" })
)(createStore);

const initialState = {};

export default createStoreWithFirebase(
  rootReducer,
  initialState,
  applyMiddleware(logger)
);
