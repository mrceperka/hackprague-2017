import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import { compose } from "redux";
import { firebaseConnect, dataToJS } from "react-redux-firebase";
import TrendingItem from "../containers/TrendingItem";
import { Container, Row, Col } from "reactstrap";

const Trending = props => {
  return (
    <Container className="trending">
      <Row>
        <Col xs={12} className="h4 text-center">Trending</Col>
        {R.keys(props.trending).map((id, i) => (
          <TrendingItem key={i} boardId={id} />
        ))}
      </Row>
    </Container>
  );
};

export default compose(
  firebaseConnect(["/trending"]),
  connect(({ firebase }, props) => {
    return {
      trending: dataToJS(firebase, "/trending")
    };
  })
)(Trending);
