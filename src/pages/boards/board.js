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
  Badge
} from "reactstrap";

import { getCheckpoints } from "../../selectors/board";

class Board extends React.Component {
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
      <Row>
        <Col>
          <Form>
            <h1>
              {this.isEdit() ? "Edit board" : "New board"}
            </h1>
            <FormGroup>
              <Label for="email_id">Tell us your email address, please</Label>
              <Input
                type="email"
                id="email_id"
                name="email"
                value={this.state.email}
                onChange={e =>
                  this.handleStringChange("email", e.target.value, true)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="title_id">Name your board</Label>
              <Input
                type="text"
                name="title"
                id="title_id"
                value={this.state.title}
                onChange={e =>
                  this.handleStringChange("title", e.target.value, true)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="image_id">Cover image link</Label>
              <Input
                type="text"
                name="image"
                id="image_id"
                value={this.state.img}
                onChange={e =>
                  this.handleStringChange("img", e.target.value, true)}
              />
            </FormGroup>

            <FormGroup tag="fieldset" row>
              <legend className="col-form-legend">
                Should it be private or publicly discoverable?
              </legend>

              <Col sm={10}>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="is_discoverable"
                      checked={this.state.is_discoverable === true}
                      onChange={() =>
                        this.handleAnyChange("is_discoverable", true)}
                    />
                    Public
                  </Label>

                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="radio"
                      name="is_discoverable"
                      checked={this.state.is_discoverable === false}
                      onChange={() =>
                        this.handleAnyChange("is_discoverable", false)}
                    />
                    Private
                  </Label>
                </FormGroup>
              </Col>
            </FormGroup>

            <FormGroup>
              <Label for="theme_id"> Select your theme</Label>
              <Input
                type="select"
                name="theme"
                id="theme_id"
                onChange={e => this.handleAnyChange("theme", e.target.value)}
                value={this.state.theme}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="desc_id">
                Give some short description to your board
              </Label>
              <Input
                type="textarea"
                name="desc"
                id="desc_id"
                value={this.state.desc}
                onChange={e => this.handleAnyChange("desc", e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label for="type_id">
                And now select you board type
              </Label>
              <Input
                type="select"
                name="type"
                id="type_id"
                onChange={e => this.handleAnyChange("type", e.target.value)}
                value={this.state.type}
              >
                <option value="basic">Basic</option>
                <option value="checkpoints">Checkpoints</option>
              </Input>
            </FormGroup>

            {this.state.type === "basic" &&
              <div>
                <FormGroup tag="fieldset">
                  <legend> Is it admin protected to change scores?</legend>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="admin_approval"
                        checked={this.state.admin_approval === true}
                        onChange={() =>
                          this.handleAnyChange("admin_approval", true)}
                      />
                      Yes
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input
                        type="radio"
                        name="admin_approval"
                        checked={this.state.admin_approval === false}
                        onChange={() =>
                          this.handleAnyChange("admin_approval", false)}
                      />
                      No
                    </Label>
                  </FormGroup>
                </FormGroup>

                <FormGroup>
                  <Label for="units_id">
                    Write down units of achievements
                  </Label>
                  <Input
                    type="text"
                    name="units"
                    id="units_id"
                    value={this.state.units}
                    onChange={e =>
                      this.handleAnyChange("units", e.target.value, true)}
                  />
                </FormGroup>
              </div>}

            {this.state.type === "checkpoints" &&
              <div className="box d-col">
                <ListGroup>
                  {R.addIndex(R.map)(
                    (item, i) =>
                      <ListGroupItem
                        className="justify-content-between"
                        key={i}
                      >
                        <div>{item.title}</div>
                        <Badge pill>{item.score}</Badge>
                        <Button
                          color="danger"
                          onClick={() => this.removeCheckpoint(item.id)}
                        >
                          Delete
                        </Button>
                      </ListGroupItem>,
                    this.state.checkpoints
                  )}
                </ListGroup>

                <FormGroup>
                  <Label for="checkpoint_title_id">Title</Label>
                  <Input
                    type="text"
                    name="checkpoint_title"
                    id="checkpoint_title_id"
                    value={this.state.checkpoint.title}
                    onChange={this.onCheckpointTitleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="checkpoint_score_id">Score</Label>
                  <Input
                    name="checkpoint_score"
                    type="number"
                    id="checkpoint_score_id"
                    value={this.state.checkpoint.score}
                    onChange={this.onCheckpointScoreChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Button color="info" onClick={this.addCheckPoint}>
                    Add
                  </Button>
                </FormGroup>

              </div>}

            <FormGroup>
              {this.isEdit()
                ? <Button color="success" onClick={this.updateBoard}>
                    Edit
                  </Button>
                : <Button color="success" onClick={this.addBoard}>
                    Add
                  </Button>}
            </FormGroup>
          </Form>
        </Col>
      </Row>
    );
  }

  handleStringChange = (name, value, trim = false) => {
    this.setState({ ...this.state, [name]: trim ? R.trim(value) : value });
  };

  handleAnyChange = (name, value) => {
    this.setState({ ...this.state, [name]: value });
  };

  onCheckpointTitleChange = e => {
    const value = e.target.value;
    this.setState(prevState => ({
      ...prevState,
      checkpoint: {
        ...prevState.checkpoint,
        title: R.trim(value)
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

    this.setState(prevstate => ({
      ...prevstate,
      checkpoints: [
        ...prevstate.checkpoints,
        {
          id,
          title: prevstate.checkpoint.title,
          score: parseInt(prevstate.checkpoint.score),
          code: shortid.generate()
        }
      ],
      checkpoint: {
        title: "",
        score: 0
      }
    }));
  };

  addBoard = () => {
    if (this.isBoardValid()) {
      const ref = this.props.firebase
        .push("/boards", this.boardToApi())
        .once("value")
        .then(snapshot => {
          const board = snapshot.val();
          const { history } = this.props;
          window.toastr.success("Added");
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

  boardToApi = () => ({
    title: this.state.title,
    is_discoverable: this.state.is_discoverable,
    admin_approve_required: this.state.admin_approval,
    description: this.state.desc,
    checkpoints: this.state.type === "checkpoints"
      ? this.state.checkpoints
      : [],
    units: this.state.units,
    email: this.state.email,
    public_code: shortid.generate(),
    admin_code: shortid.generate(),
    img: this.state.img
  });

  updateBoard = () => {
    if (this.isBoardValid()) {
      const { board, match } = this.props;
      const id = match.params.id;
      this.props.firebase.update("/boards/" + id, this.boardToApi(), () =>
        window.toastr.success("Updated")
      );
    }
  };

  isBoardValid = () => {
    if (isEmail(this.state.email) === false) {
      window.toastr.error("Fill valid email please");
      return false;
    }

    if (
      this.state.type === "checkpoints" &&
      this.state.checkpoints.length === 0
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

export default compose(firebaseConnect())(Board);
