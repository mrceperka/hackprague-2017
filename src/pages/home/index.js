import R from "ramda";
import React from "react";
import { compose } from "redux";
import { Link } from "react-router-dom";
import { firebaseConnect, dataToJS, isEmpty } from "react-redux-firebase";
import { connect } from "react-redux";
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
  Jumbotron,
  Container,
  Row,
  Col
} from "reactstrap";

import AppHeader from "../../components/AppHeader";
import Leaderboard from "../../components/Leaderboard";

class Home extends React.Component {
  state = {
    code: "",
    boards: []
  };

  componentWillReceiveProps(nextProps) {
    this.fetchTrendingBoard(nextProps);
  }

  findByCode = () => {
    const { firebase, history } = this.props;

    firebase
      .ref("boards")
      .orderByChild("public_code")
      .equalTo(this.state.code)
      .once("value")
      .then(foo => {
        const boards = foo.val();

        if (boards) {
          const boardKey = R.pipe(R.keys, R.take(1))(boards);
          history.push("/boards/" + boards[boardKey].public_code);
        } else {
          window.toastr.warning("Sadly, we dont't have that board", "", {
            timeOut: 1000
          });
        }
      });
  };

  fetchTrendingBoard = ({ trending, firebase }) => {
    if (isEmpty(trending) === false) {
      const ids = R.keys(trending);
      R.forEach(id => {
        firebase.ref("/boards/" + id).once("value").then(r => {
          const board = r.val();

          this.setState(prevState => ({
            ...prevState,
            boards: [...prevState.boards, { ...board, id }]
          }));
        });
      }, ids);
    }
  };

  handleAnyChange = (name, value) => {
    this.setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  render() {
    return (
      <div className="main-header">
        <AppHeader />
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
                <Form
                  inline
                  onSubmit={e => {
                    e.preventDefault();
                    this.findByCode();
                  }}
                >
                  <FormGroup>
                    <InputGroup size="lg">
                      <InputGroupAddon>#</InputGroupAddon>
                      <Input
                        autoFocus
                        type="text"
                        value={this.state.code}
                        placeholder="Enter code"
                        onChange={e =>
                          this.handleAnyChange("code", e.target.value)}
                      />
                    </InputGroup>
                    <Button size="lg" onClick={this.findByCode} color="primary">
                      Go
                    </Button>
                  </FormGroup>
                </Form>
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
        <Row>
          <Col xs={12}>Trending</Col>

          {R.map(board => <Leaderboard users={[]} board={board} />)}
        </Row>
      </div>
    );
  }
}

export default compose(
  firebaseConnect(props => {
    return ["/trending"];
  }),
  connect(({ firebase }, props) => {
    return {
      trending: dataToJS(firebase, "/trending")
    };
  })
)(Home);
