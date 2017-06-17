import R from "ramda";
import React from "react";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { firebaseConnect } from "react-redux-firebase";

class Home extends React.Component {
  state = {
    code: ""
  };

  findByCode = () => {
    const { firebase, history } = this.props;

    firebase
      .ref("boards")
      .orderByChild("public_code")
      .equalTo(this.state.code)
      .once("value")
      .then(foo => {
        const boards = foo.val();

        if (boards) {
          const boardKey = R.pipe(R.keys, R.take(1))(boards);
          history.push("/boards/" + boardKey);
        }
      });
  };

  handleAnyChange = (name, value) => {
    this.setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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
            <input
              type="text"
              value={this.state.code}
              onChange={e => this.handleAnyChange("code", e.target.value)}
            />
            Input search
            <button onClick={this.findByCode}>Go</button>
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

export default compose(firebaseConnect())(Home);
