import React from "react";
import { Col, Row } from "reactstrap";

function PageTitle(props) {
  return (
    <Row>
      <Col>
        <h1 className="page-title">
          {props.children}
        </h1>
      </Col>
    </Row>
  );
}

export default PageTitle;
