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

export default props => (
  <Modal isOpen={props.isOpen} toggle={props.toggle}>
    <ModalHeader toggle={props.toggle}>
      Please, insert checkpoint code
    </ModalHeader>
    <ModalBody>
      <InputGroup>
        <InputGroupAddon>code</InputGroupAddon>
        <Input
          placeholder="Checkpoint code"
          value={props.name}
          onChange={props.onChange}
        />
      </InputGroup>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={props.onClick}>
        Complete checkpoint
      </Button>
    </ModalFooter>
  </Modal>
);
