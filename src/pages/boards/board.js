import React from "react";
import R from "ramda";
import uuid from "uuid";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  firebaseConnect,
  isLoaded,
  isEmpty,
  dataToJS
} from "react-redux-firebase";

import { Button, List, ListItem, IconButton } from "react-toolbox";

import { getCheckpoints } from "../../selectors/board";
class Board extends React.Component {
  state = {
    title: "",
    desc: "",
    type: "basic",
    checkpoint: {
      title: "",
      score: 0
    },
    checkpoints: [],
    admin_approval: 0
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

  boardToState = board => {
    this.setState({
      title: board.title,
      desc: board.description,
      checkpoints: getCheckpoints(board),
      admin_approval: board.admin_approve_required ? 1 : 0,
      type: R.keys(board.checkpoints).length > 0 ? "checkpoints" : "basic"
    });
  };

  render() {
    return (
      <div className="box d-col ai-c fb-100">
        <div className="header">
          {this.isEdit() ? "Edit board" : "New board"}
        </div>
        <div className="box d-col">
          <div className="box d-col">
            <div className="label">Title</div>
            <div>
              <input
                type="text"
                className="input"
                value={this.state.title}
                onChange={this.onTitleChange}
              />
            </div>
          </div>
          <div className="box d-col">
            <div className="label">Description</div>
            <div>
              <textarea
                style={{ minHeight: 100 }}
                className="input"
                value={this.state.desc}
                onChange={this.onDescriptionChange}
              />
            </div>
          </div>
          <div className="box d-col">
            <div className="label">Admin approval</div>
            <div>
              <input
                type="radio"
                name="admin_approval"
                defaultChecked={this.state.admin_approval === 1}
                value={1}
                onChange={this.onAdminRadioChange}
              />
              Yes
            </div>
            <div>
              <input
                type="radio"
                name="admin_approval"
                defaultChecked={this.state.admin_approval === 0}
                value={0}
                onChange={this.onAdminRadioChange}
              />
              No
            </div>
          </div>
          <div className="box d-col">
            <div className="label">Type</div>
            <div>
              <select
                name="type"
                value={this.state.type}
                onChange={this.onTypeChange}
              >
                <option value="basic">Basic</option>
                <option value="checkpoints">Checkpoints</option>
              </select>
            </div>
          </div>
          {this.state.type === "checkpoints" &&
            <div className="box d-col">
              <List>
                {R.addIndex(R.map)(
                  (item, i) =>
                    <div key={i}>
                      <ListItem
                        caption={item.title}
                        legend={"Score: " + item.score}
                        rightActions={[
                          <IconButton
                            key={1}
                            onClick={() => this.removeCheckpoint(item.id)}
                            icon="delete"
                          />
                        ]}
                      />
                    </div>,
                  this.state.checkpoints
                )}
              </List>
              <div className="box d-col">
                <div className="box d-col">
                  <div className="label">Title</div>
                  <div>
                    <input
                      type="text"
                      name="checkpoint_title"
                      className="input"
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
                      className="input"
                      value={this.state.checkpoint.score}
                      onChange={this.onCheckpointScoreChange}
                    />
                  </div>
                </div>
                <div className="spacer spacer-small" />
                <div className="box">
                  <Button
                    label="Add"
                    onClick={this.addCheckPoint}
                    icon="add"
                    raised
                  />
                </div>
              </div>
            </div>}
          <div className="spacer" />
          <div className="spacer" />
          <div className="box">
            {this.isEdit()
              ? <Button
                  label="Edit"
                  icon="edit"
                  onClick={this.updateBoard}
                  primary
                />
              : <Button
                  label="Add"
                  icon="add"
                  onClick={this.addBoard}
                  primary
                />}

          </div>
        </div>
      </div>
    );
  }

  onTitleChange = e => {
    const value = e.target.value;
    this.setState({ title: R.trim(value) });
  };

  onDescriptionChange = e => {
    const value = e.target.value;
    this.setState({ desc: value });
  };

  onAdminRadioChange = e => {
    const value = e.target.value;
    this.setState({ admin_approval: value });
  };

  onTypeChange = e => {
    const value = e.target.value;
    this.setState({
      type: value
    });
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
    this.setState(prevstate => ({
      ...prevstate,
      checkpoints: [
        ...prevstate.checkpoints,
        {
          id: uuid.v4(),
          title: prevstate.checkpoint.title,
          score: parseInt(prevstate.checkpoint.score)
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
          history.push("/boards/" + id);
        });
    }
  };

  boardToApi = () => ({
    title: this.state.title,
    admin_approve_required: this.state.admin_approval === 1 ? true : false,
    description: this.state.desc,
    checkpoints: this.state.type === "checkpoints" ? this.state.checkpoints : []
  });

  updateBoard = () => {
    if (this.isBoardValid()) {
      const { board, match } = this.props;
      const id = match.params.id;
      this.props.firebase.update("/boards/" + id, this.boardToApi(), () =>
        alert("Done")
      );
    }
  };

  isBoardValid = () => {
    if (
      this.state.type === "checkpoints" &&
      this.state.checkpoints.length === 0
    ) {
      alert("fill checkpoints please");
      return false;
    }
    if (this.state.title === "") {
      alert("fill title please");
      return false;
    }
    return true;
  };

  isEdit = () => this.props.board != null;
}

export default compose(firebaseConnect())(Board);
