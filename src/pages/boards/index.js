import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

class Boards extends React.Component {
  render() {
    return (
      <div className="box d-col fb-100">
        {this.props.boards
          ? R.map(
              board =>
                <div key={board.id}>
                  <Link to={"/boards/" + board.id}>{board.title}</Link>
                </div>,
              this.getBoards()
            )
          : <div>No boards</div>}
      </div>
    );
  }

  getBoards = () => {
    const { boards } = this.props;
    if (boards) {
      return R.map(key => ({ ...boards[key], id: key }), R.keys(boards));
    }
    return [];
  };
}

export default compose(
  firebaseConnect(["/boards"]),
  connect(({ firebase }) => ({ boards: dataToJS(firebase, "/boards") }))
)(Boards);
