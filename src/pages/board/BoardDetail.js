import React from "react";
import R from "ramda";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS,
  orderedToJS
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

import PageTitle from "../../components/Page/Title";
import Leaderboard from "../../containers/Leaderboard";
import { InputModal } from "../../components/Modal";

import { getUsers, getCheckpoints, isBasic } from "../../selectors/board";

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
              "/users/" + boardID,
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

    firebase.push(
      "/records/" + boardID + "/" + user.id,
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

    return (
      <div>
        <Container className="leaderboard-detail">
          <Leaderboard board={board} />

          <InputModal
            header="How you be calling yourself matey?"
            inputLabel="Name"
            inputPlaceholder="Your name"
            buttonLabel="Add me"
            isOpen={this.state.show_modal}
            toggle={this.toggleNameModal}
            name={this.state.name}
            onChange={e => this.handleChange("name", e.target.value)}
            onSubmit={this.onOnboardClick}
          />

          <InputModal
            header="Please, insert checkpoint code"
            inputLabel="Code"
            inputPlaceholder="Checkpoint code"
            buttonLabel="Complete checkpoint"
            isOpen={this.state.show_checkpoint_modal}
            toggle={this.toggleCheckpointModal}
            name={this.state.checkpoint_code}
            onChange={e => this.handleChange("checkpoint_code", e.target.value)}
            onSubmit={this.onCheckCodeClick}
          />

          {/* add button / user component */}
          <div className="fixed-button">
            <Button
              className="btn-block"
              color="primary"
              onClick={this.updateScoreOrShowModal}
            >
              Add my score
            </Button>
          </div>
        </Container>
      </div>
    );
  };
}

export default compose(
  connect(({ firebase }) => {
    const boards = orderedToJS(firebase, "boards");
    const first = boards ? boards[0] : null;
    return {
      board: first ? { ...first, id: first.key } : null,
      users: orderedToJS(firebase, "boardUsers")
    };
  }),
  firebaseConnect(({ match, board }) => {
    return [
      {
        path: "/boards",
        queryParams: [
          "orderByChild=public_code",
          "equalTo=" + match.params.id,
          "limitToFirst=1"
        ]
      },
      {
        path: "/users/" + (isEmpty(board) ? 0 : board.id),
        storeAs: "boardUsers"
      }
    ];
  })
)(BoardDetail);
