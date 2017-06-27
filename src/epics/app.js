import { combineEpics } from "redux-observable";
import { Observable } from "rxjs";

import { signInAnonymously } from "../actions/auth";

const startAppEpic = action$ =>
  action$.ofType("START_APP").mergeMap(() => {
    return Observable.of(signInAnonymously());
  });

const appEpic = combineEpics(startAppEpic);
export default appEpic;
