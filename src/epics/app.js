import { combineEpics } from "redux-observable";
import { Observable } from "rxjs";

import { signIn } from "../actions/auth";
import { createTempUser } from "../actions/user";

const startAppEpic = action$ =>
  action$.ofType("START_APP").mergeMap(() => {
    return Observable.concat(
      Observable.of(signIn())
      //Observable.of(createTempUser())
    );
  });

const appEpic = combineEpics(startAppEpic);
export default appEpic;
