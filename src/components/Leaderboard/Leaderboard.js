import React from "react";
import R from "ramda";
import { Col, Row, Button, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";

import Header from "./Header";
import TopThree from "./TopThree";

import {
  isBasic,
  getCheckpoints,
  getCheckpointsCodes
} from "../../selectors/board";

const getUserCheckpointCodes = ({ firebase, user, board }) => {
  user.__do_not_checkpoints_codes = [];
  firebase
    .ref("/boards/" + board.id + "/records/" + user.id)
    .on("value", snapshot => {
      const vals = snapshot.val();

      if (vals) {
        const checkpoint_ids = R.map(
          id => vals[id].checkpoint_id,
          R.keys(vals)
        );

        user.__do_not_checkpoints_codes = R.filter(
          ch_id => ch_id != null,
          checkpoint_ids
        );
      }
    });
};

function Leaderboard({ users, board, firebase, inCard }) {
  const topThree = R.take(3, users);
  const inCardClass = inCard ? " in-card" : "";
  return (
    <div className={"leaderboard" + inCardClass}>
      <Header board={board} firebase={firebase} inCard={inCard} />
      <TopThree
        board={board}
        firebase={firebase}
        first={topThree[0]}
        second={topThree[1]}
        third={topThree[2]}
        units={board.units}
        inCard={inCard}
      />
      <ListGroup>
        {users.map((user, i) => {
          const boardCheckpointIds = getCheckpointsCodes(board);
          // MUTATION
          getUserCheckpointCodes({ firebase, user, board });

          return i > 2
            ? <ListGroupItem key={i} className="justify-content-between">
                <div style={{ position: "relative" }}>
                  <img
                    style={{ width: 40 }}
                    src={"/static/avatars/" + (i % 7 + 1) + ".png"}
                  />
                  <div
                    className="badge badge-default rounded-circle"
                    style={{ position: "absolute", bottom: -5, left: 0 }}
                  >
                    {i + 1}
                  </div>
                </div>
                <div>
                  {user.name}
                </div>
                <div>
                  {isBasic(board)
                    ? <span>
                        {user.score} {board.units}
                      </span>
                    : <span>
                        {
                          R.intersection(
                            user.__do_not_checkpoints_codes,
                            boardCheckpointIds
                          ).length
                        }
                        /
                        {boardCheckpointIds.length}
                        {" "}
                        ({user.score} {board.units})
                      </span>}
                </div>
              </ListGroupItem>
            : null;
        })}
      </ListGroup>
    </div>
  );
}

export default Leaderboard;
