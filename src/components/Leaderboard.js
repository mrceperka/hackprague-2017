import React from "react";
import R from "ramda";
import { Col, Row, Button, ListGroup, ListGroupItem } from "reactstrap";

function Leaderboard({ users, board, updateScoreOrShowModal }) {
  const topThree = R.take(3, users);
  return (
    <div className="leaderboard">
      <div
        className="top"
        style={{ backgroundImage: "url(" + board.img + ")" }}
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
      <TopThree
        first={topThree[0]}
        second={topThree[1]}
        third={topThree[2]}
        units={board.units}
      />
      {users.length > 10 &&
        <Row>
          <Col xs={12}>
            <Button
              className="btn-block"
              color="primary"
              onClick={updateScoreOrShowModal}
            >
              Add
            </Button>
          </Col>
        </Row>}
      <ListGroup>
        {users.map((user, i) => {
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
                  {user.score} {board.units}
                </div>
              </ListGroupItem>
            : null;
        })}
      </ListGroup>
    </div>
  );
}

function TopThree({ first, second, third, units }) {
  return (
    <Row>
      <Col xs={12}>
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
    <Col xs={12} sm={4} className="top-item text-center">
      <img style={{ width: 100 }} src={src} />
      <h4>{user.name}</h4>
      <p>{user.score} {units}</p>
    </Col>
  );
}

export default Leaderboard;
