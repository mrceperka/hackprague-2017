import { combineEpics } from "redux-observable";
import { Cookies } from "react-cookie";
import { AUTH_COOKIE_NAME } from "../constants";
import { setId, setLoggedIn, setAnonymous } from "../actions/auth";
import { Observable } from "rxjs";

const signInAnonymouslyEpic = (action$, store, { getFirebase }) =>
  action$.ofType("SIGN_IN_ANONYMOUSLY").mergeMap(() => {
    const cookie = new Cookies();
    const authCookie = cookie.get(AUTH_COOKIE_NAME);
    if (authCookie) {
      //check from firebase
      return Observable.concat(
        Observable.of(setId(authCookie)),
        Observable.of(setLoggedIn(true)),
        Observable.of(setAnonymous(false))
      );
    } else {
      const id = "anonymous";
      cookie.set(AUTH_COOKIE_NAME, id);
      return Observable.concat(
        Observable.of(setId(id)),
        Observable.of(setLoggedIn(false)),
        Observable.of(setAnonymous(true))
      );
    }
    // return Observable.empty();
    // return Observable.from(getFirebase().auth().signInAnonymously())
    //   .mergeMap(val => Observable.of(signInAnonymouslySuccess(val)))
    //   .catch(e => signInAnonymouslyFail(e));
  });

const authEpic = combineEpics(signInAnonymouslyEpic);
export default authEpic;
