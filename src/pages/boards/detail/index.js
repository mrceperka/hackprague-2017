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

import { ShareButtons, ShareCounts, generateShareIcon } from "react-share";

const { FacebookShareButton } = ShareButtons;
const FacebookIcon = generateShareIcon("facebook");

import AppHeader from "../../../components/AppHeader";
import PageTitle from "../../../components/PageTitle";
import Leaderboard from "../../../components/Leaderboard";

import { getUsers, getCheckpoints, isBasic } from "../../../selectors/board";

class BoardDetail extends React.Component {
  state = {
    show_modal: false,
    show_checkpoint_modal: false,
    name: "",
    checkpoint_code: "",
    checkpoint: null
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
      const { firebase, match, board } = this.props;
      const boardID = board.id;

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
    const found = R.find(
      ch => ch.code === this.state.checkpoint_code,
      checkpoints
    );

    if (found != null) {
      this.setState(
        {
          checkpoint: found
        },
        () => this.updateScore()
      );
    } else {
      window.toastr.warning("Code was not found.");
    }
  };

  getCurrentBoardUser = () => {
    const { board } = this.props;
    const name = localStorage.getItem("name");

    if (name) {
      this.setState({ name });
    }

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
    const boardID = board.id;

    const user = this.getCurrentBoardUser();
    console.log(this.state.checkpoint.id);
    firebase.push(
      "/boards/" + boardID + "/records/" + user.id,
      {
        checkpoint_id: this.state.checkpoint ? this.state.checkpoint.id : null,
        timestamp: +new Date(),
        score: this.state.checkpoint ? this.state.checkpoint.score : 1,
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
    return board.sort === "ASC" ? a.score - b.score : b.score - a.score;
  };

  getSorted = () => {
    const { board } = this.props;
    const top = R.pipe(getUsers, R.sort(this.sortByScore));
    return top(board);
  };

  render = () => {
    const { board } = this.props;
    return isLoaded(board)
      ? isEmpty(board) ? this.renderEmpty() : this.renderLeaderBoard()
      : this.renderWaiting();
  };

  renderEmpty = () => {
    return (
      <Row className="loading"><Col xs={12}>No participants yet...</Col></Row>
    );
  };

  renderWaiting = () => {
    return <div className="loading">Loading...</div>;
  };

  renderLeaderBoard = () => {
    const { board } = this.props;

    {
      /*<FacebookShareButton
      url={window.location.href}
      title={board.title}
    >
      <FacebookIcon size={32} round />
    </FacebookShareButton>*/
    }
    return (
      <div>
        <AppHeader />
        <Container className="leaderboard-detail">
          <Leaderboard
            users={this.getSorted()}
            board={board}
            firebase={this.props.firebase}
          />

          <Modal isOpen={this.state.show_modal} toggle={this.toggleNameModal}>
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

          <Row>
            <Col xs={12} md={{ size: 8, offset: 2 }}>
              <Button
                className="btn-block"
                color="primary"
                onClick={this.updateScoreOrShowModal}
              >
                Add
              </Button>
            </Col>
          </Row>

        </Container>
      </div>
    );
  };
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
  connect(({ firebase }, { match }) => {
    const boards = dataToJS(firebase, "boards");
    const id = R.keys(dataToJS(firebase, "boards"))[0];
    return {
      board: boards ? { ...boards[id], id } : null
    };
  })
)(BoardDetail);
