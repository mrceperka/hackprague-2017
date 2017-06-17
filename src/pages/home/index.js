import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

class Home extends React.Component {
  render() {
    return (
      <div className="box d-col fb-100">
        <div className="box">
          Kapoard
          Instant leaderboards for anything.
          Browse, join, compete!
        </div>
        <div className="box js-c">
          <div className="box ai-c label">
            Board code
          </div>
          <div>
            <input className="input" type="text" />
          </div>
        </div>
        <div className="spacer" />
        <div className="box js-c">
          or
        </div>
        <div className="spacer" />
        <div className="box js-c">
          <Link to="/boards/new">
            <div className="button">Create a board</div>
          </Link>
        </div>
      </div>
    );
  }
}

export default compose(
  firebaseConnect(["/boards"]),
  connect(({ firebase }) => ({ boards: dataToJS(firebase, "/boards") }))
)(Home);
