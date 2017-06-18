import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

import {
  Col,
  Row,
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroupAddon,
  InputGroup
} from "reactstrap";

import AppHeader from "../../../components/AppHeader";

import { getUsers, getCheckpoints, isBasic } from "../../../selectors/board";

class BoardDetail extends React.Component {
  state = {
    show_modal: false,
    show_checkpoint_modal: false,
    name: "",
    checkpoint_code: ""
  };

  handleChange = (name, value) => {
    this.setState(prevState => ({ ...prevState, [name]: R.trim(value) }));
  };

  toggleNameModal = () =>
    this.setState(prev => ({ ...prev, show_modal: !prev.show_modal }));

  toggleCheckpointModal = () =>
    this.setState(prev => ({
      ...prev,
      show_checkpoint_modal: !prev.show_checkpoint_modal
    }));

  onOnboardClick = () => {
    if (this.state.name !== "") {
      const { firebase, match } = this.props;
      const boardID = match.params.id;

      firebase
        .ref("/boards/" + boardID + "/users")
        .orderByChild("name")
        .equalTo(this.state.name)
        .once("value")
        .then(r => {
          if (r.val() != null) {
            window.toastr.error("Someone has already taken that name :(");
          } else {
            //save locally
            localStorage.setItem("name", this.state.name);

            //hide modal
            this.setState({ show_modal: false });

            //push new user
            firebase.push(
              "/boards/" + boardID + "/users",
              {
                name: this.state.name,
                score: 0
              },
              () => {
                window.toastr.success("Yeeey, you have joined the board");
              }
            );
          }
        });
    } else {
      window.toastr.warning("Tell us you name please");
    }
  };

  onCheckCodeClick = () => {
    const { board } = this.props;
    const checkpoints = getCheckpoints(board);
    const found =
      R.find(ch => ch.code === this.state.checkpoint_code, checkpoints) != null;

    if (found) {
      this.updateScore();
    } else {
      window.toastr.warning("Code was not found.");
    }
  };

  getCurrentBoardUser = () => {
    const { board } = this.props;
    const name = localStorage.getItem("name");
    return R.find(user => user.name === name, getUsers(board));
  };

  shouldDisplayUserNameDialog = () => {
    return this.getCurrentBoardUser() == null;
  };

  updateScore = () => {
    this.setState({ show_modal: false });
    this.setState({ show_checkpoint_modal: false });
    this.setState({ checkpoint_code: "" });

    const { firebase, match, board } = this.props;
    const id = match.params.id;

    const user = this.getCurrentBoardUser();
    firebase.push(
      "/boards/" + id + "/records/" + user.id,
      {
        timestamp: +new Date(),
        score: 1,
        is_approved: isBasic(board) && board.admin_approve_required
          ? false
          : true
      },
      () => {
        window.toastr.success("Added!");
      }
    );
  };

  updateScoreOrShowModal = () => {
    const { board } = this.props;
    if (this.shouldDisplayUserNameDialog()) {
      this.setState({ show_modal: true });
    } else if (getCheckpoints(board).length > 0) {
      this.setState({ show_checkpoint_modal: true });
    } else {
      this.updateScore();
    }
  };

  sortByScore = (a, b) => {
    const { board } = this.props;
    return board.sort === "ASC" ? a.score > b.score : a.score < b.score;
  };

  getTopThree = () => {
    const { board } = this.props;
    return R.take(3, this.getSorted());
  };

  getSorted = () => {
    const { board } = this.props;
    const top = R.pipe(getUsers, R.sort(this.sortByScore));
    return top(board);
  };

  render = () => {
    const { board } = this.props;
    let topThree = this.getTopThree();

    return (
      <div>
        <AppHeader />
        {isLoaded(board)
          ? <Container>
              <div className="box">
                <div>
                  <img style={{ width: 100 }} src="/static/trophy.svg" />
                </div>
                <div className="box ai-c" style={{ overflow: "auto" }}>
                  {board.description}
                </div>
              </div>
              <div>
                <TopThree
                  first={topThree[0]}
                  second={topThree[1]}
                  third={topThree[2]}
                />
              </div>
              <div className="box d-col">
                {this.getSorted().map((user, i) => {
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

              <Modal
                isOpen={this.state.show_modal}
                toggle={this.toggleNameModal}
              >
                <ModalHeader>
                  How you be calling yourself matey?
                </ModalHeader>
                <ModalBody>
                  <InputGroup>
                    <InputGroupAddon>name</InputGroupAddon>
                    <Input
                      placeholder="Your name"
                      value={this.state.name}
                      onChange={e => this.handleChange("name", e.target.value)}
                    />
                  </InputGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.onOnboardClick}>
                    On board!
                  </Button>
                </ModalFooter>
              </Modal>

              <Modal
                isOpen={this.state.show_checkpoint_modal}
                toggle={this.toggleCheckpointModal}
              >
                <ModalHeader toggle={this.toggleCheckpointModal}>
                  Please, insert checkpoint code
                </ModalHeader>
                <ModalBody>
                  <InputGroup>
                    <InputGroupAddon>code</InputGroupAddon>
                    <Input
                      placeholder="Checkpoint code"
                      value={this.state.checkpoint_code}
                      onChange={e =>
                        this.handleChange("checkpoint_code", e.target.value)}
                    />
                  </InputGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.onCheckCodeClick}>
                    Check
                  </Button>
                </ModalFooter>
              </Modal>

              <Button color="primary" onClick={this.updateScoreOrShowModal}>
                Add
              </Button>
            </Container>
          : <div className="loading">Loading...</div>}
      </div>
    );
  };
}

function TopThree(props) {
  return (
    <div className="box">
      {second &&
        <TopItem pos={2} user={props.second} src="/static/silver-star.svg" />}

      {first &&
        <TopItem pos={1} user={props.first} src="/static/gold-star.svg" />}

      {third &&
        <TopItem pos={3} user={props.third} src="/static/bronze-star.svg" />}
    </div>
  );
}

function TopItem({ user, src, pos }) {
  return (
    <div className="box d-col ai-c" style={{ paddingTop: pos !== 1 ? 10 : 0 }}>
      <div className="box">
        <img style={{ width: 100 }} src={src} />
      </div>
      <div className="box d-col jc-c ai-c">
        <div>{pos}.</div>
        <div>{user.name}</div>
        <div>{user.score}</div>
      </div>
    </div>
  );
}

export default compose(
  firebaseConnect(({ match }) => {
    return [
      {
        path: "/boards",
        queryParams: ["orderByChild=public_code", "equalTo=" + match.params.id]
      }
    ];
  }),
  connect(({ firebase }, ownProps) => {
    return {
      board: dataToJS(firebase, "boards")
    };
  })
)(BoardDetail);
