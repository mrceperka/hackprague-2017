import React from "react";
import {
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  FormText
} from "reactstrap";
import uuid from "uuid";

class _Input extends React.Component {
  componentWillMount() {
    this.id = uuid.v4();
  }

  render() {
    const {
      label,
      icon,
      autoFocus,
      type,
      name,
      value,
      onChange,
      subtitle,
      children,
      ...rest
    } = this.props;
    return (
      <FormGroup>
        <Label for={this.id}>
          {label}
          {subtitle
            ? <FormText color="muted">
                {subtitle}
              </FormText>
            : null}
        </Label>
        <InputGroup>
          {icon
            ? <InputGroupAddon>
                <i className="material-icons">{icon}</i>
              </InputGroupAddon>
            : null}
          <Input
            autoFocus={autoFocus}
            type={type}
            id={this.id}
            name={name}
            value={value}
            onChange={onChange}
            {...rest}
          >
            {children}
          </Input>
        </InputGroup>
      </FormGroup>
    );
  }
}

export default _Input;
