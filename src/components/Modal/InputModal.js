import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Button
} from "reactstrap";

class InputModal extends React.Component {
  render() {
    return (
      <Modal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader>
          {this.props.header}
        </ModalHeader>
        <ModalBody>
          <Form
            onSubmit={e => {
              e.preventDefault();
              this.props.onSubmit();
            }}
          >
            <InputGroup>
              <InputGroupAddon>{this.props.inputLabel}</InputGroupAddon>
              <FocusedInput
                placeholder={this.props.inputPlaceholder}
                value={this.props.name}
                onChange={this.props.onChange}
              />
            </InputGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.props.onSubmit}>
            {this.props.buttonLabel}
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

export default InputModal;
