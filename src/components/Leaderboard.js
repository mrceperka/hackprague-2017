import React from "react";
import R from "ramda";
import { Col, Row, Button, ListGroup, ListGroupItem } from "reactstrap";
import { isBasic, getCheckpoints } from "../selectors/board";
import { Link } from "react-router-dom";

function Leaderboard({ users, board, firebase, inCard }) {
  const topThree = R.take(3, users);
  const inCardClass = inCard ? " in-card" : "";
  return (
    <div className={"leaderboard" + inCardClass}>
      <LeaderboardHeader board={board} firebase={firebase} inCard={inCard} />
      <TopThree
        first={topThree[0]}
        second={topThree[1]}
        third={topThree[2]}
        units={board.units}
      />
      <ListGroup>
        {users.map((user, i) => {
          const boardCheckpointIds = R.map(
            chp => chp.id,
            getCheckpoints(board)
          );
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
                    {i}
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

function TopThree({ first, second, third, units }) {
  return (
    <Row>
      <Col xs={12} lg={{ size: 10, offset: 1 }}>
        <Row>
          {second &&
            <TopItem
              pos={2}
              user={second}
              units={units}
              src="/static/silver-star.svg"
            />}

          {first &&
            <TopItem
              pos={1}
              user={first}
              units={units}
              src="/static/gold-star.svg"
            />}

          {third &&
            <TopItem
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

function TopItem({ user, src, pos, units }) {
  return (
    <Col xs={4} className={"text-center top-item top-item" + pos}>
      <img style={{ width: 100 }} src={src} />
      <h4>{user.name}</h4>
      <p>{user.score} {units}</p>
      <div className={"pod pod" + pos}>
        {pos}
      </div>
    </Col>
  );
}

export default Leaderboard;
