import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { firebaseConnect, dataToJS } from "react-redux-firebase";

class Home extends React.Component {
  render() {
    return (
      <div>
          <h1>
            Kapoard
          </h1>
          <p>
            Instant leaderboards for anything.
            Browse, join, compete!
          </p>
          <div className="box jc-sa ai-c">
            <div className="box">
              Input search
            </div>
            <div className="box">
              <Link to="/boards/new">
                Start new
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
