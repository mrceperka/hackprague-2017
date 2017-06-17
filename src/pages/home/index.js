import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { firebaseConnect, dataToJS } from "react-redux-firebase";

import { Layout, Button, Input, Panel } from "react-toolbox";

class Home extends React.Component {
  render() {
    return (
      <Layout>
        <Panel>
          <h1>
            Kapoard
          </h1>
          <p>
            Instant leaderboards for anything.
            Browse, join, compete!
          </p>
          <div className="box jc-sa ai-c">
            <div className="box">
              <Input label="Code" type="text" icon="search" />
            </div>
            <div className="box">
              <Link to="/boards/new">
                <Button label="Start new" raised />
              </Link>
            </div>
          </div>
        </Panel>
      </Layout>
    );
  }
}

export default compose(
  firebaseConnect(["/boards"]),
  connect(({ firebase }) => ({ boards: dataToJS(firebase, "/boards") }))
)(Home);
