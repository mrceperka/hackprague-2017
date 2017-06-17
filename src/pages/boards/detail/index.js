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
  sortByScore = (a, b) => {
    const { board } = this.props;
    return board.sort === "ASC" ? a.score > b.score : a.score < b.score;
  };

  getTopThree = () => {
    const { board } = this.props;
    return R.take(3, this.getSorted());
  };

  getSorted = () => {
    const { board } = this.props;
    const top = R.pipe(getUsers, R.sort(this.sortByScore));
    return top(board);
  };

  renderTopItem({ user, src, pos }) {
    return (
      <div
        className="box d-col ai-c"
        style={{ paddingTop: pos !== 1 ? 10 : 0 }}
      >
        <div className="box">
          <img style={{ width: 100 }} src={src} />
        </div>
        <div className="box d-col jc-c ai-c">
          <div>{pos}.</div>
          <div>{user.name}</div>
          <div>{user.score}</div>
        </div>
      </div>
    );
  }

  renderTop3() {
    const top3 = this.getTopThree();
    const first = top3[0];
    const second = top3[1];
    const third = top3[2];

    return (
      <div className="box">
        {second &&
          this.renderTopItem({
            pos: 2,
            user: second,
            src: "/static/silver-star.svg"
          })}
        {first &&
          this.renderTopItem({
            pos: 1,
            user: first,
            src: "/static/gold-star.svg"
          })}
        {third &&
          this.renderTopItem({
            pos: 3,
            user: third,
            src: "/static/bronze-star.svg"
          })}
      </div>
    );
  }

  render() {
    const { board } = this.props;
    return (
      <div className="box d-col fb-100">
        {isLoaded(board)
          ? <div className="box d-col">
              <div className="box">
                <div>
                  <img style={{ width: 100 }} src="/static/trophy.svg" />
                </div>
                <div className="box ai-c" style={{ overflow: "auto" }}>
                  {board.description}
                </div>
              </div>
              <div>
                {this.renderTop3()}
              </div>
              <div className="box d-col">
                {this.getSorted().map((user, i) => {
                  return i > 2
                    ? <div key={i} className="box">
                        <div>
                          {i}.
                        </div>
                        <div>
                          {user.name}
                        </div>
                        <div>
                          {user.score}
                        </div>
                      </div>
                    : null;
                })}
              </div>
              <div />
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
