import React from "react";
import R from "ramda";
import { Col, Row, Button, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";

import {
  isBasic,
  getCheckpoints,
  getCheckpointsCodes
} from "../selectors/board";

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
      <LeaderboardHeader board={board} firebase={firebase} inCard={inCard} />
      <TopThree
        board={board}
        firebase={firebase}
        first={topThree[0]}
        second={topThree[1]}
        third={topThree[2]}
        units={board.units}
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

function LeaderboardHeader({ board, inCard }) {
  return inCard
    ? <LeaderboardHeaderWithLink board={board} />
    : <LeaderboardHeaderWithoutLink board={board} />;
}

function LeaderboardHeaderWithoutLink({ board }) {
  let imageUrl = board.img.length > 0 ? board.img : "/static/trophy.svg";
  let empty = board.img.length === 0 ? " empty" : "";
  return (
    <div
      className={"top" + empty}
      style={{ backgroundImage: "url(" + imageUrl + ")" }}
    >
      <div className="overlay">
        <h3>
          {board.title}
        </h3>
        <p>
          {board.description}
        </p>
      </div>
    </div>
  );
}

function LeaderboardHeaderWithLink({ board }) {
  return (
    <Link to={"/boards/" + board.public_code}>
      <LeaderboardHeaderWithoutLink board={board} />
    </Link>
  );
}

function TopThree({ first, second, third, units, firebase, board }) {
  if (first) {
    // MUTATION
    getUserCheckpointCodes({ firebase, user: first, board });
  }
  if (second) {
    // MUTATION
    getUserCheckpointCodes({ firebase, user: second, board });
  }
  if (third) {
    // MUTATION
    getUserCheckpointCodes({ firebase, user: third, board });
  }
  return (
    <Row>
      <Col xs={12} lg={{ size: 10, offset: 1 }}>
        <Row>
          {second &&
            <TopItem
              board={board}
              pos={2}
              user={second}
              units={units}
              src="/static/silver-star.svg"
            />}

          {first &&
            <TopItem
              board={board}
              pos={1}
              user={first}
              units={units}
              src="/static/gold-star.svg"
            />}

          {third &&
            <TopItem
              board={board}
              pos={3}
              user={third}
              units={units}
              src="/static/bronze-star.svg"
            />}
        </Row>
      </Col>
    </Row>
  );
}

function TopItem({ user, src, pos, units, board }) {
  const boardCheckpointIds = getCheckpointsCodes(board);
  return (
    <Col xs={4} className={"text-center top-item top-item" + pos}>
      <img style={{ width: 100 }} src={src} />
      <h4>{user.name}</h4>
      <p>
        {isBasic(board)
          ? <span>{user.score} {units}</span>
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
      </p>
      <div className={"pod pod" + pos}>
        {pos}
      </div>
    </Col>
  );
}

export default Leaderboard;
