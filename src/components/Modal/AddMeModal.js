import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Button
} from "reactstrap";

class AddMeModal extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>
          How you be calling yourself matey?
        </ModalHeader>
        <ModalBody>
          <InputGroup>
            <InputGroupAddon>name</InputGroupAddon>
            <FocusedInput
              getRef={this.props.inputRef}
              placeholder="Your name"
              value={this.props.name}
              onChange={this.props.onChange}
            />
          </InputGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.onClick}>
            On board!
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

class FocusedInput extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.focusedInput.focus();
    }, 300);
  }
  render() {
    return (
      <Input
        {...this.props}
        getRef={input => {
          this.focusedInput = input;
        }}
      />
    );
  }
}

export default AddMeModal;
