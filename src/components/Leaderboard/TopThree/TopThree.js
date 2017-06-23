import React from "react";
import { Col, Row } from "reactstrap";

import TopItem from "../TopItem";

export default ({ first, second, third, units, board, inCard }) => {
  return (
    <Row>
      <Col xs={12} lg={{ size: 10, offset: 1 }}>
        <Row>
          {second &&
            <TopItem
              board={board}
              pos={2}
              user={second}
              inCard={inCard}
              src="/static/silver-star.svg"
            />}

          {first &&
            <TopItem
              board={board}
              pos={1}
              user={first}
              inCard={inCard}
              src="/static/gold-star.svg"
            />}

          {third &&
            <TopItem
              board={board}
              pos={3}
              user={third}
              inCard={inCard}
              src="/static/bronze-star.svg"
            />}
        </Row>
      </Col>
    </Row>
  );
};
