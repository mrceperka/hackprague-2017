import "rxjs";
import { combineEpics } from "redux-observable";
import app from "./app";
import auth from "./auth";
import user from "./user";

const rootEpic = combineEpics(app, auth, user);
export default rootEpic;
