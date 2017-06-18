import React from "react";
import R from "ramda";
import uuid from "uuid";
import isEmail from "validator/lib/isEmail";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

import { getCheckpoints } from "../../selectors/board";

class Board extends React.Component {
  state = {
    title: "",
    email: "",
    desc: "",
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
      <div className="box d-col ai-c fb-100">
        <div className="header">
          {this.isEdit() ? "Edit board" : "New board"}
        </div>
        <div className="box d-col">
          <div className="box d-col">
            <div>
              Tell us your email address, please
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={this.state.email}
                onChange={e =>
                  this.handleStringChange("email", e.target.value, true)}
              />
            </div>
          </div>

          <div className="box d-col">
            <div>
              Name your board
            </div>
            <div>
              <input
                type="text"
                name="title"
                value={this.state.title}
                onChange={e =>
                  this.handleStringChange("title", e.target.value, true)}
              />
            </div>
          </div>

          <div className="box d-col">
            <div className="label">
              Should it be private or publicly discoverable?
            </div>
            <div>
              <input
                type="radio"
                name="is_discoverable"
                checked={this.state.is_discoverable === true}
                onChange={() => this.handleAnyChange("is_discoverable", true)}
              />
              Public
              <input
                type="radio"
                name="is_discoverable"
                checked={this.state.is_discoverable === false}
                onChange={() => this.handleAnyChange("is_discoverable", false)}
              />
              Private
            </div>
          </div>
          <div className="box d-col">
            <div>
              Select your theme
            </div>
            <div>
              <select
                onChange={e => this.handleAnyChange("theme", e.target.value)}
                value={this.state.theme}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>
          <div className="box d-col">
            <div>
              Give some short description to your board
            </div>
            <div>
              <textarea
                name="desc"
                value={this.state.desc}
                onChange={e => this.handleAnyChange("desc", e.target.value)}
              />
            </div>
          </div>
          <div className="box d-col">
            <div>
              And now select you board type
            </div>
            <div>
              <select
                onChange={e => this.handleAnyChange("type", e.target.value)}
                value={this.state.type}
              >
                <option value="basic">Basic</option>
                <option value="checkpoints">Checkpoints</option>
              </select>
            </div>
          </div>
          {this.state.type === "basic" &&
            <div>
              <div className="box d-col">
                <div className="label">
                  Is it admin protected to change scores?
                </div>
                <div>
                  <input
                    type="radio"
                    name="admin_approval"
                    checked={this.state.admin_approval === true}
                    onChange={() =>
                      this.handleAnyChange("admin_approval", true)}
                  />
                  Yes
                  <input
                    type="radio"
                    name="admin_approval"
                    checked={this.state.admin_approval === false}
                    onChange={() =>
                      this.handleAnyChange("admin_approval", false)}
                  />
                  No
                </div>
              </div>

              <div className="box d-col">
                <div>
                  Write down units of achievements
                </div>
                <div>
                  <input
                    type="text"
                    name="units"
                    value={this.state.units}
                    onChange={e =>
                      this.handleAnyChange("units", e.target.value, true)}
                  />
                </div>
              </div>
            </div>}

          {this.state.type === "checkpoints" &&
            <div className="box d-col">
              <div className="box d-col">
                {R.addIndex(R.map)(
                  (item, i) =>
                    <div className="box" key={i}>
                      <div>{item.title}</div>
                      <div>{"Score: " + item.score}</div>
                      <div onClick={() => this.removeCheckpoint(item.id)}>
                        Delete
                      </div>
                    </div>,
                  this.state.checkpoints
                )}
              </div>
              <div className="box d-col">
                <div className="box d-col">
                  <div className="label">Title</div>
                  <div>
                    <input
                      type="text"
                      name="checkpoint_title"
                      value={this.state.checkpoint.title}
                      onChange={this.onCheckpointTitleChange}
                    />
                  </div>
                </div>
                <div className="box d-col">
                  <div className="label">Score</div>
                  <div>
                    <input
                      name="checkpoint_score"
                      type="number"
                      value={this.state.checkpoint.score}
                      onChange={this.onCheckpointScoreChange}
                    />
                  </div>
                </div>
                <div className="spacer spacer-small" />
                <div className="box">
                  <div onClick={this.addCheckPoint}>Add</div>
                </div>
              </div>
            </div>}

          <div className="spacer" />
          <div className="spacer" />
          <div className="box">
            {this.isEdit()
              ? <div onClick={this.updateBoard}>Edit</div>
              : <div onClick={this.addBoard}>Add</div>}

          </div>
        </div>
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
    this.setState(prevstate => ({
      ...prevstate,
      checkpoints: [
        ...prevstate.checkpoints,
        {
          id,
          title: prevstate.checkpoint.title,
          score: parseInt(prevstate.checkpoint.score),
          code: R.takeLast(2, boardId) + R.takeLast(3, id)
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
        .then(snapshot => {
          const id = snapshot.key;
          const { history } = this.props;
          window.toastr.success("Added");
          history.push("/boards/" + id);
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
    email: this.state.email
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
