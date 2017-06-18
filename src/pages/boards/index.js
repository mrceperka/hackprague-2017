import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

import {
  Container,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Badge,
  Row,
  Col
} from "reactstrap";
import AppHeader from "../../components/AppHeader";
import PageTitle from "../../components/PageTitle";

class Boards extends React.Component {
  renderEmpty = () => <div>It looks that we are out of boards...</div>;
  renderWaiting = () => <Row><Col>Loading</Col></Row>;
  renderLeaderBoard = () =>
    <ListGroup>
      {R.map(
        board =>
          <ListGroupItem className="justify-content-between" key={board.id}>
            <ListGroupItemHeading>
              <Link
                to={
                  this.props.isAdmin === true
                    ? "/boards/edit/" + board.id
                    : "/boards/" + board.public_code
                }
              >
                {board.title}
              </Link>
            </ListGroupItemHeading>
            <ListGroupItemText>
              {board.description}
            </ListGroupItemText>
          </ListGroupItem>,
        this.getBoards()
      )}
    </ListGroup>;
  render() {
    const { boards } = this.props;

    return (
      <div>
        <AppHeader />
        <Container>
          <PageTitle>Boards</PageTitle>
          {isLoaded(boards)
            ? isEmpty(boards) ? this.renderEmpty() : this.renderLeaderBoard()
            : this.renderWaiting()}
        </Container>
      </div>
    );
  }

  getBoards = () => {
    const { boards } = this.props;
    if (boards) {
      return R.map(key => ({ ...boards[key], id: key }), R.keys(boards));
    }
    return [];
  };
}

export default compose(
  firebaseConnect(["/boards"]),
  connect(({ firebase }) => ({ boards: dataToJS(firebase, "/boards") }))
)(Boards);
