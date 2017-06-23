import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

import { Row, Col } from "reactstrap";

import BoardNew from "./BoardNew";
import Loading from "../../components/Loading";

const Edit = ({ board, ...rest }) =>
  (isLoaded(board)
    ? isEmpty(board)
        ? <div>Board does not exist</div>
        : <BoardNew board={board} {...rest} />
    : <Loading />);

export default compose(
  firebaseConnect(["/boards"]),
  connect(({ firebase }, { match }) => {
    return {
      board: dataToJS(firebase, "/boards/" + match.params.id)
    };
  })
)(Edit);
