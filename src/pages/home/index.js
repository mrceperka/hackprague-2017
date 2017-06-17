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
        <div className="box d-col ai-c">
          <div>Kapoard</div>
          <div>
            Instant leaderboards for anything.
            Browse, join, compete!
          </div>
        </div>
        <div className="box js-sa">
          <div className="box">
            <div>
              <input className="input" type="text" />

            </div>
            <div>
              <div className="button">🔎</div>
            </div>
          </div>
          <div className="box">
            <Link to="/boards/new">
              <div className="button">Start new</div>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  firebaseConnect(["/boards"]),
  connect(({ firebase }) => ({ boards: dataToJS(firebase, "/boards") }))
)(Home);
