import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

const App = props => {
  return <div>App {console.log(props)}</div>;
};

export default compose(
  firebaseConnect(["/todos"]),
  connect(({ firebase }) => ({ todos: dataToJS(firebase, "/todos") }))
)(App);
