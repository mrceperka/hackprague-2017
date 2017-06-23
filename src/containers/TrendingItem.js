import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  dataToJS,
  orderedToJS,
  isEmpty
} from "react-redux-firebase";
import { Col } from "reactstrap";

import Leaderboard from "../components/Leaderboard";

const TrendingItem = ({ board, users }) => {
  return !isEmpty(board) && !isEmpty(users)
    ? <Col xs={12} lg={4}>
        <Leaderboard users={R.take(3, users)} board={board} inCard={true} />
      </Col>
    : null;
};

export default compose(
  firebaseConnect(({ boardId }) => ["/boards/" + boardId, "/users/" + boardId]),
  connect(({ firebase }, { boardId }) => {
    return {
      board: dataToJS(firebase, "/boards/" + boardId),
      users: orderedToJS(firebase, "/users/" + boardId)
    };
  })
)(TrendingItem);
