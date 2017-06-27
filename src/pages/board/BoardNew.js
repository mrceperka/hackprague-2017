import React from "react";
import R from "ramda";
import uuid from "uuid";
import shortid from "shortid";
import isEmail from "validator/lib/isEmail";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Col,
  Row,
  ListGroup,
  ListGroupItem,
  Badge,
  Container,
  InputGroupAddon,
  InputGroup
} from "reactstrap";

import PageTitle from "../../components/Page/Title";
import Page from "../../components/Page";
import { TextInput, RadioInput, CheckpointInput } from "../../components/Input";

import { getCheckpoints } from "../../selectors/board";

class BoardNew extends React.Component {
  state = {
    title: "",
    email: "",
    desc: "",
    img: "",
    theme: "dark",
    units: "points",
    type: "basic",
    is_discoverable: true,
    checkpoint: {
      title: "",
      score: 0
    },
    checkpoints: [],
    admin_approval: false
  };

  componentDidMount() {
    if (this.isEdit()) {
      this.boardToState(this.props.board);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.isEdit()) {
      this.boardToState(nextProps.board);
    }
  }

  render() {
    return (
      <Page>
        <Row>
          <Col md={{ size: 8, offset: 2 }}>
            <Form>
              <PageTitle>
                {this.isEdit() ? "Edit board" : "New board"}
              </PageTitle>

              <TextInput
                label="Your email address"
                icon="email"
                autoFocus
                type="email"
                name="email"
                value={this.state.email}
                onChange={e => this.handleAnyChange("email", e.target.value)}
              />

              <TextInput
                label="Board name"
                type="text"
                name="title"
                value={this.state.title}
                onChange={e => this.handleAnyChange("title", e.target.value)}
              />

              <TextInput
                label="Board description"
                style={{ minHeight: 100 }}
                type="textarea"
                name="desc"
                value={this.state.desc}
                onChange={e => this.handleAnyChange("desc", e.target.value)}
              />

              <TextInput
                label="Board cover image link"
                icon="link"
                type="text"
                name="image"
                value={this.state.img}
                onChange={e => this.handleAnyChange("img", e.target.value)}
              />

              <hr />
              <div className="spacer" />

              <TextInput
                label="Board type"
                subtitle="Basic for simple +1 boards, Checkpoints for series"
                type="select"
                name="type"
                value={this.state.type}
                onChange={e => this.handleAnyChange("type", e.target.value)}
              >
                <option value="basic">Basic</option>
                <option value="checkpoints">Checkpoints</option>
              </TextInput>

              {this.state.type === "basic" &&
                <div>
                  <RadioInput
                    label="Requires admin's approval?"
                    subtitle="Votes of users has to go through admin who is THE validator"
                    name="admin_approval"
                    onChange={this.handleAnyChange}
                    value={this.state.admin_approval}
                    options={[
                      { value: true, content: "Yes" },
                      { value: false, content: "No" }
                    ]}
                  />

                  <TextInput
                    label="Units of achievements"
                    subtitle="km, kg, apples eaten,..."
                    type="text"
                    name="units"
                    value={this.state.units}
                    onChange={e =>
                      this.handleAnyChange("units", e.target.value)}
                  />
                </div>}

              {this.state.type === "checkpoints" &&
                <CheckpointInput
                  checkpoints={this.state.checkpoints}
                  checkpoint={this.state.checkpoint}
                  onDelete={this.removeCheckpoint}
                  onTitleChange={this.onCheckpointTitleChange}
                  onScoreChange={this.onCheckpointScoreChange}
                  addCheckPoint={this.addCheckPoint}
                />}

              <hr />
              <div className="spacer" />

              <RadioInput
                label="Should it be private or publicly discoverable?"
                name="is_discoverable"
                onChange={this.handleAnyChange}
                value={this.state.is_discoverable}
                options={[
                  {
                    value: true,
                    content: (
                      <div>
                        <i className="material-icons">public</i>
                        Public
                      </div>
                    )
                  },
                  {
                    value: false,
                    content: (
                      <div>
                        <i className="material-icons">lock</i>
                        Private
                      </div>
                    )
                  }
                ]}
              />

              <div className="spacer" />
              <div className="spacer" />

              <FormGroup className="text-center">
                <Button
                  className="btn-block"
                  size="lg"
                  color="success"
                  onClick={this.isEdit() ? this.updateBoard : this.addBoard}
                >
                  {this.isEdit() ? "Edit" : "Add"}
                </Button>
              </FormGroup>
            </Form>
          </Col>
        </Row>
      </Page>
    );
  }

  handleAnyChange = (name, value) => {
    this.setState({ ...this.state, [name]: value });
  };

  onCheckpointTitleChange = e => {
    const value = e.target.value;
    this.setState(prevState => ({
      ...prevState,
      checkpoint: {
        ...prevState.checkpoint,
        title: value
      }
    }));
  };

  onCheckpointScoreChange = e => {
    const value = e.target.value;
    this.setState(prevState => ({
      ...prevState,
      checkpoint: {
        ...prevState.checkpoint,
        score: value
      }
    }));
  };

  removeCheckpoint = id => {
    this.setState(prevState => ({
      ...prevState,
      checkpoints: R.reject(item => item.id === id, prevState.checkpoints)
    }));
  };

  addCheckPoint = () => {
    const { match } = this.props;
    const boardId = match.params.id;
    const id = uuid.v4();

    if (this.state.checkpoint.title !== "") {
      this.setState(prevstate => ({
        ...prevstate,
        checkpoints: [
          ...prevstate.checkpoints,
          {
            id,
            title: R.trim(prevstate.checkpoint.title),
            score: parseInt(prevstate.checkpoint.score),
            code: shortid.generate()
          }
        ],
        checkpoint: {
          title: "",
          score: 0
        }
      }));
    } else {
      window.toastr.warning("Please, fill the title of a checkpoint", "", {
        timeOut: 500
      });
    }
  };

  addBoard = () => {
    if (this.isBoardValid()) {
      const ref = this.props.firebase
        .push("/boards", this.boardToApi())
        .once("value")
        .then(snapshot => {
          const board = snapshot.val();
          const { history } = this.props;
          window.toastr.success("Added, trying to send a board email");

          window.emailjs
            .send("mail_ru", "basic_to", {
              to: board.email,
              board_link: "http://kapoard.com/boards/edit/" + snapshot.key
            })
            .then(
              function(response) {
                window.toastr.success("Check your inbox for detail", "", {
                  timeOut: 500
                });
              },
              function(error) {
                window.toastr.warning("Mail sending failed");
                console.log(error);
              }
            );

          history.push("/boards/" + board.public_code);
        });
    }
  };

  boardToState = board => {
    this.setState({
      title: board.title,
      is_discoverable: board.is_discoverable,
      desc: board.description,
      checkpoints: getCheckpoints(board),
      admin_approval: board.admin_approve_required,
      units: board.units,
      email: board.email,
      img: board.img ? board.img : "",

      //bonus
      type: R.keys(board.checkpoints).length > 0 ? "checkpoints" : "basic"
    });
  };

  boardToApi = () => {
    let data = {
      title: this.state.title,
      is_discoverable: this.state.is_discoverable,
      admin_approve_required: this.state.admin_approval,
      description: this.state.desc,
      checkpoints: this.state.type === "checkpoints"
        ? this.state.checkpoints
        : [],
      units: this.state.units,
      email: this.state.email,

      img: this.state.img
    };

    if (this.isEdit() === false) {
      data.public_code = shortid.generate();
      data.admin_code = shortid.generate();
    }

    return data;
  };

  updateBoard = () => {
    if (this.isBoardValid()) {
      const { board, match, history } = this.props;
      const id = match.params.id;
      this.props.firebase.update("/boards/" + id, this.boardToApi(), () => {
        window.toastr.success("Updated");
        history.push("/boards/" + board.public_code);
      });
    }
  };

  isBoardValid = () => {
    if (isEmail(this.state.email) === false) {
      window.toastr.error("Fill valid email please");
      return false;
    }

    if (
      this.state.type === "checkpoints" && this.state.checkpoints.length === 0
    ) {
      window.toastr.error("Fill some checkpoints please");
      return false;
    }

    if (this.state.title === "") {
      window.toastr.error("Fill title");
      return false;
    }
    return true;
  };

  isEdit = () => this.props.board != null;
}

export default compose(firebaseConnect())(BoardNew);
