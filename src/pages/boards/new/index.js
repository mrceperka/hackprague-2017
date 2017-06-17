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

class NewBoard extends React.Component {
  state = {
    title: "",
    desc: "",
    type: "basic",
    checkpoint: {
      title: "",
      points: 0
    },
    checkpoints: [],
    admin_approval: 0
  };
  render() {
    return (
      <div className="box d-col ai-c fb-100">
        <div className="header">New board</div>
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
                value={1}
                onChange={this.onAdminRadioChange}
              />
              Yes
            </div>
            <div>
              <input
                type="radio"
                name="admin_approval"
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
                defaultValue={this.state.type}
                onChange={this.onTypeChange}
              >
                <option value="basic">Basic</option>
                <option value="checkpoints">Checkpoints</option>
              </select>
            </div>
          </div>
          {this.state.type === "checkpoints" &&
            <div className="box d-col">
              <div className="box d-col">
                {R.addIndex(R.map)(
                  (item, i) =>
                    <div key={i} className="box">
                      <div>{item.title}</div>
                      <div>{item.points}</div>
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
                      className="input"
                      value={this.state.checkpoint.title}
                      onChange={this.onCheckpointTitleChange}
                    />
                  </div>
                </div>
                <div className="box d-col">
                  <div className="label">Points</div>
                  <div>
                    <input
                      name="checkpoint_points"
                      type="number"
                      className="input"
                      value={this.state.checkpoint.points}
                      onChange={this.onCheckpointPointsChange}
                    />
                  </div>
                </div>
                <div className="spacer spacer-small" />
                <div className="box">
                  <div className="button" onClick={this.addCheckPoint}>Add</div>
                </div>
              </div>
            </div>}
          <div className="spacer" />
          <div className="spacer" />
          <div className="box">
            <div className="button" onClick={this.addBoard}>Add board</div>
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

  onCheckpointPointsChange = e => {
    const value = e.target.value;
    this.setState(prevState => ({
      ...prevState,
      checkpoint: {
        ...prevState.checkpoint,
        points: value
      }
    }));
  };

  addCheckPoint = () => {
    this.setState(prevstate => ({
      ...prevstate,
      checkpoints: [
        ...prevstate.checkpoints,
        {
          title: prevstate.checkpoint.title,
          points: parseInt(prevstate.checkpoint.points)
        }
      ],
      checkpoint: {
        title: "",
        points: 0
      }
    }));
  };

  addBoard = () => {
    this.props.firebase.push(
      "/boards",
      {
        title: this.state.title,
        description: this.state.desc,
        checkpoints: this.state.checkpoints
      },
      e => {
        console.log("success");
      }
    );
  };
}

export default compose(firebaseConnect())(NewBoard);
