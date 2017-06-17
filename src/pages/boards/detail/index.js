import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

class BoardDetail extends React.Component {
  state = {
    board: null,
    loading: true
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    const board = this.props.firebase
      .database()
      .ref("/boards/" + id)
      .once("value")
      .then(snapshot => {
        this.setState({ loading: false, board: snapshot.val() });
      });
  }
  render() {
    const { board } = this.state;
    return (
      <div className="box d-col fb-100">
        {this.state.loading === false
          ? <div>{board.title}</div>
          : <div className="loading">Loading...</div>}
      </div>
    );
  }
}

export default compose(firebaseConnect())(BoardDetail);
