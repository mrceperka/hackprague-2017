import { combineEpics } from "redux-observable";
import { Cookies } from "react-cookie";
import { AUTH_COOKIE_NAME } from "../constants";
import {
  setId,
  setLoggedIn,
  setAnonymous,
  signIn,
  setVerified
} from "../actions/auth";
import { Observable } from "rxjs";

const signInAnonymouslyEpic = (action$, store, { getFirebase }) =>
  action$.ofType("SIGN_IN").mergeMap(() => {
    const cookie = new Cookies();
    const authCookie = cookie.get(AUTH_COOKIE_NAME);
    if (authCookie) {
      return Observable.from(
        getFirebase().ref("/users/" + authCookie).once("value")
      )
        .mergeMap(snapshot => {
          const user = snapshot.val();

          return Observable.concat(
            Observable.of(setId(snapshot.key)),
            Observable.of(setLoggedIn(true)),
            Observable.of(setVerified(user.verified))
          );
        })
        .catch(e => Observable.of({ type: "SIGN_IN_VERIFICATION_FAILED" }));
    } else {
      return Observable.empty();
    }
  });

const authCookieEpic = action$ =>
  action$.ofType("AUTH_SET_COOKIE").mergeMap(({ payload }) => {
    const cookie = new Cookies();
    cookie.set(AUTH_COOKIE_NAME, payload, { path: "/" });
    return Observable.of(signIn());
  });

const authEpic = combineEpics(signInAnonymouslyEpic, authCookieEpic);
export default authEpic;
