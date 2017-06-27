import React from "react";

import { Row, Col } from "reactstrap";

const MenuItem = ({ authInfo }) =>
  <div className="nav-link">
    {console.log(authInfo)}
    <Row>
      <Col>
        <i className="material-icons">account_circle</i>
        {authInfo.verified
          ? <i
              style={{
                position: "absolute",
                bottom: 0,
                right: 5,
                fontSize: 15,
                color: "green"
              }}
              className="material-icons"
            >
              verified_user
            </i>
          : <i
              style={{
                position: "absolute",
                bottom: 0,
                right: 5,
                fontSize: 15,
                color: "orange"
              }}
              className="material-icons"
            >
              warning
            </i>}
      </Col>
    </Row>
  </div>;

export default MenuItem;
