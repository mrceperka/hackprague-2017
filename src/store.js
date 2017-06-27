import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
import logger from "redux-logger";
import { createEpicMiddleware } from "redux-observable";

import firebaseConfig from "./config/firebase";
import rootReducer from "./reducers";
import rootEpic from "./epics";

const epicMiddleware = createEpicMiddleware(rootEpic, {
  dependencies: { getFirebase }
});
const initialState = {};
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  initialState,
  composeEnhancers(
    reactReduxFirebase(firebaseConfig, { userProfile: "users" }),
    applyMiddleware(epicMiddleware /*logger*/)
  )
);
