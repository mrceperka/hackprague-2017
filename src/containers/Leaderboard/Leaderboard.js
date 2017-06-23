import React from "react";
import { connect } from "react-redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS,
  orderedToJS
} from "react-redux-firebase";

import Leaderboard from "../../components/Leaderboard";

export default connect(({ firebase }) => ({
  users: orderedToJS(firebase, "boardUsers") || []
}))(Leaderboard);
