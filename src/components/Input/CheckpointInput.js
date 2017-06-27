import React from "react";
import {
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  Button,
  Badge
} from "reactstrap";

export default props => (
  <div className="box d-col">
    <ListGroup>
      {props.checkpoints.map((item, i) => (
        <ListGroupItem className="justify-content-between" key={i}>
          <div>{item.title}</div>
          <div>{item.code}</div>
          <Badge pill>{item.score}</Badge>
          <div
            className="text-danger"
            style={{ cursor: "pointer" }}
            onClick={() => props.onDelete(item.id)}
          >
            <i className="material-icons">delete</i>
          </div>
        </ListGroupItem>
      ))}
    </ListGroup>
    <div className="spacer" />
    <Row>
      <Col md={{ size: 7, offset: 1 }} xs={{ size: 11, offset: 1 }}>
        <InputGroup>
          <InputGroupAddon>
            Title
          </InputGroupAddon>
          <Input
            type="text"
            name="checkpoint_title"
            value={props.checkpoint.title}
            onChange={props.onTitleChange}
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
            value={props.checkpoint.score}
            onChange={props.onScoreChange}
          />
        </InputGroup>
      </Col>
      <Col
        md={{ size: 4, pull: 1 }}
        xs={12}
        className="d-flex justify-content-end align-items-center"
      >
        <Button color="info" onClick={props.addCheckPoint}>
          Add
        </Button>
      </Col>
    </Row>

  </div>
);
