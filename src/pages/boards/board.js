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

import AppHeader from "../../components/AppHeader";
import PageTitle from "../../components/PageTitle";

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
      <div>
        <AppHeader />
        <Container>
          <Row>
            <Col md={{ size: 8, offset: 2 }}>
              <Form>
                <PageTitle>
                  {this.isEdit() ? "Edit board" : "New board"}
                </PageTitle>

                <FormGroup>
                  <Label for="email_id">Your email address</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <i className="material-icons">email</i>
                    </InputGroupAddon>
                    <Input
                      type="email"
                      id="email_id"
                      name="email"
                      value={this.state.email}
                      onChange={e =>
                        this.handleStringChange("email", e.target.value, true)}
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <Label for="title_id">Board name</Label>
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
                  <Label for="desc_id">
                    Board description
                  </Label>
                  <Input
                    style={{ minHeight: 100 }}
                    type="textarea"
                    name="desc"
                    id="desc_id"
                    value={this.state.desc}
                    onChange={e => this.handleAnyChange("desc", e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="image_id">Board cover image link</Label>
                  <InputGroup>
                    <InputGroupAddon>
                      <i className="material-icons">link</i>
                    </InputGroupAddon>
                    <Input
                      type="text"
                      name="image"
                      id="image_id"
                      value={this.state.img}
                      onChange={e =>
                        this.handleStringChange("img", e.target.value, true)}
                    />
                  </InputGroup>
                </FormGroup>

                <hr />
                <div className="spacer" />

                <FormGroup>
                  <Label for="type_id">
                    Board type
                    <FormText color="muted">
                      Basic for simple +1 boards, Checkpoints for series
                    </FormText>
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
                      <legend className="col-form-legend">
                        Requires admin's approval?
                        <FormText color="muted">
                          Votes of users has to go through admin who is THE
                          validator
                        </FormText>
                      </legend>
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
                        Units of achievements
                        <FormText color="muted">
                          km, kg, apples_eaten,...
                        </FormText>
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
                    <div className="spacer" />
                    <Row>
                      <Col
                        md={{ size: 7, offset: 1 }}
                        xs={{ size: 11, offset: 1 }}
                      >
                        <InputGroup>
                          <InputGroupAddon>
                            Title
                          </InputGroupAddon>
                          <Input
                            type="text"
                            name="checkpoint_title"
                            value={this.state.checkpoint.title}
                            onChange={this.onCheckpointTitleChange}
                          />
                        </InputGroup>

                        <div className="spacer" />

                        <InputGroup>
                          <InputGroupAddon>
                            Score
                          </InputGroupAddon>
                          <Input
                            name="checkpoint_score"
                            type="number"
                            value={this.state.checkpoint.score}
                            onChange={this.onCheckpointScoreChange}
                          />
                        </InputGroup>
                      </Col>
                      <Col
                        md={{ size: 4, pull: 1 }}
                        xs={12}
                        className="d-flex justify-content-end align-items-center"
                      >
                        <FormGroup>
                          <Button color="info" onClick={this.addCheckPoint}>
                            Add
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>

                  </div>}

                <hr />
                <div className="spacer" />

                <FormGroup tag="fieldset">
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
                        <div className="box">
                          <i className="material-icons">public</i>
                          Public
                        </div>
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
                        <div className="box">
                          <i className="material-icons">lock</i>
                          Private
                        </div>
                      </Label>
                    </FormGroup>
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Label for="theme_id">Pick a theme</Label>
                  <Input
                    type="select"
                    name="theme"
                    id="theme_id"
                    onChange={e =>
                      this.handleAnyChange("theme", e.target.value)}
                    value={this.state.theme}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </Input>
                </FormGroup>

                <div className="spacer" />
                <div className="spacer" />

                <FormGroup className="text-center">
                  {this.isEdit()
                    ? <Button color="success" onClick={this.updateBoard}>
                        Edit
                      </Button>
                    : <Button
                        className="btn-block"
                        size="lg"
                        color="success"
                        onClick={this.addBoard}
                      >
                        Add
                      </Button>}
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
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

    if (this.state.checkpoint.title !== "") {
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
