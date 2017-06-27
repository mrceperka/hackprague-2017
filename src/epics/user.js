import { combineEpics } from "redux-observable";

import { createTempUserSuccess, createTempUserFail } from "../actions/user";
import { setId, setAuthCookie } from "../actions/auth";
import { Observable } from "rxjs";

const createTempUserEpic = (action$, store, { getFirebase }) =>
  action$.ofType("CREATE_TEMP_USER").mergeMap(() => {
    return Observable.from(
      getFirebase().push("/users", {
        verified: false,
        name: "mr_anonymous"
      })
    )
      .mergeMap(snapshot => {
        const id = snapshot.key;
        return Observable.concat(
          Observable.of(createTempUserSuccess()),
          Observable.of(setAuthCookie(id))
        );
      })
      .catch(e => Observable.of(createTempUserFail()));
  });

const userEpic = combineEpics(createTempUserEpic);
export default userEpic;
