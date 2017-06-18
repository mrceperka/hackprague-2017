import React from "react";
import R from "ramda";
import { Col, Row } from "reactstrap";

function Leaderboard(props) {
  const topThree = R.take(3, props.users);
  return (
    <div>
      <TopThree first={topThree[0]} second={topThree[1]} third={topThree[2]} />
      <div className="box d-col">
        {props.users.map((user, i) => {
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
    </div>
  );
}

function TopThree(props) {
  return (
    <Row>

      {props.second &&
        <TopItem pos={2} user={props.second} src="/static/silver-star.svg" />}

      {props.first &&
        <TopItem pos={1} user={props.first} src="/static/gold-star.svg" />}

      {props.third &&
        <TopItem pos={3} user={props.third} src="/static/bronze-star.svg" />}

    </Row>
  );
}

function TopItem({ user, src, pos }) {
  return (
    <Col xs={12} sm={4}>
      <div className="box">
        <img style={{ width: 100 }} src={src} />
      </div>
      <div className="box d-col jc-c ai-c">
        <div>{pos}.</div>
        <div>{user.name}</div>
        <div>{user.score}</div>
      </div>
    </Col>
  );
}

export default Leaderboard;
