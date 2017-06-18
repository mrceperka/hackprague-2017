import React from "react";
import R from "ramda";
import { Col, Row } from "reactstrap";

function Leaderboard({ users, board }) {
  console.log(users);
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
      <div className="box d-col">
        {users.map((user, i) => {
          return i > 2
            ? <div key={i}>
                <hr />
                <Row>
                  <Col xs={2} className="text-center">
                    {i}.
                  </Col>
                  <Col xs={8}>
                    {user.name}
                  </Col>
                  <Col xs={2} className="text-center">
                    {user.score} {board.units}
                  </Col>
                </Row>
              </div>
            : null;
        })}
      </div>
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
