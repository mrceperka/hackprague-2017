import "rxjs";
import { combineEpics } from "redux-observable";
import app from "./app";
import auth from "./auth";

const rootEpic = combineEpics(app, auth);
export default rootEpic;
