import React from "react";
import { Col, Row } from "reactstrap";

export default props =>
  <Row>
    <Col>
      <h1 className="page-title">
        {props.children}
      </h1>
    </Col>
  </Row>;
