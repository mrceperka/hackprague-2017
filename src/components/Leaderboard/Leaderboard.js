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

export default ({ users, board, firebase, inCard }) => {
  const sortedUsers = R.sort(
    (a, b) => (board.sort === "ASC" ? a.score - b.score : b.score - a.score),
    users
  );

  const topThree = R.take(3, sortedUsers);
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
};
