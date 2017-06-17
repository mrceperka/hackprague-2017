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

import { getUsers } from "../../../selectors/board";

class BoardDetail extends React.Component {
  sortByScore = (a, b, type = "DESC") => {
    return type === "ASC" ? a.score > b.score : a.score < b.score;
  };

  getTopThree = () => {
    const { board } = this.props;
    const top3 = R.pipe(getUsers, R.sort(this.sortByScore), R.take(3));

    return top3(board);
  };

  render() {
    const { board } = this.props;
    return (
      <div className="box d-col fb-100">
        {isLoaded(board)
          ? <div className="box d-col">
              <div>
                {board.title}
              </div>
              <div>
                {this.getTopThree().map((user, i) =>
                  <div key={i}> {user.name} {user.score}</div>
                )}
              </div>
              <div>
                <img src="/static/gold-star.svg" />
              </div>
            </div>
          : <div className="loading">Loading...</div>}
      </div>
    );
  }
}

export default compose(
  firebaseConnect(["/boards"]),
  connect(({ firebase }, { match }) => {
    return {
      board: dataToJS(firebase, "/boards/" + match.params.id)
    };
  })
)(BoardDetail);
