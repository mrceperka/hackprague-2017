import React from "react";
import R from "ramda";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";
import { connect } from "react-redux";
import {
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Button
} from "reactstrap";

class SearchByCode extends React.Component {
  state = {
    code: ""
  };

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

  handleAnyChange = (name, value) => {
    this.setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  render() {
    return (
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
              onChange={e => this.handleAnyChange("code", e.target.value)}
            />
          </InputGroup>
          <Button size="lg" onClick={this.findByCode} color="primary">
            Go
          </Button>
        </FormGroup>
      </Form>
    );
  }
}
export default firebaseConnect()(SearchByCode);
