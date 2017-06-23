import React from "react";
import { Link } from "react-router-dom";
import { Button, Jumbotron, Container, Row, Col } from "reactstrap";

import Trending from "../../containers/Trending";
import SearchByCode from "../../containers/SearchByCode";

export default props => {
  return (
    <div>
      <div className="main-header">
        <Jumbotron>
          <Container>
            <Row>
              <Col className="text-center bottom-margin">
                <h1>
                  Instant leaderboards in 60 seconds or less.
                </h1>
                <p className="lead">
                  Browse, join, create, compete!
                </p>
              </Col>
            </Row>

            <Row>
              <Col className="text-center">
                <SearchByCode history={props.history} />
              </Col>
            </Row>

            <Row>
              <Col className="text-center or lead">
                or
              </Col>
            </Row>

            <Row>
              <Col className="text-center">
                <Link to="/boards/new">
                  <Button size="lg" color="success">
                    Create new leaderboard
                  </Button>
                </Link>
              </Col>
            </Row>
          </Container>
        </Jumbotron>
      </div>
      <Trending />
    </div>
  );
};
