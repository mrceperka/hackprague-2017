import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { firebaseConnect, dataToJS } from "react-redux-firebase";

import { Container, Row, Col } from "reactstrap";

class Home extends React.Component {
  render() {
    return (
      <Container>
        <Row>
          Kapoard
        </Row>
        <Row>
          Instant leaderboards for anything.
          Browse, join, compete!
        </Row>
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
      </Container>
    );
  }
}

export default compose(
  firebaseConnect(["/boards"]),
  connect(({ firebase }) => ({ boards: dataToJS(firebase, "/boards") }))
)(Home);
