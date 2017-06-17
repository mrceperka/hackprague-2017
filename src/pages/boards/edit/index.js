import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

import Board from "../board";

const Edit = ({ board, ...rest }) =>
  isLoaded(board) ? <Board board={board} {...rest} /> : <div>Loading</div>;

export default compose(
  firebaseConnect(["/boards"]),
  connect(({ firebase }, { match }) => {
    return {
      board: dataToJS(firebase, "/boards/" + match.params.id)
    };
  })
)(Edit);
