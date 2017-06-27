import React from "react";
import { FormGroup, Label, Input, FormText } from "reactstrap";

class RadioInput extends React.Component {
  render() {
    const {
      label,
      subtitle,
      name,
      value,
      onChange,
      options,
      ...rest
    } = this.props;
    return (
      <FormGroup tag="fieldset">
        <legend className="col-form-legend">
          {label}
          {subtitle
            ? <FormText color="muted">
                {subtitle}
              </FormText>
            : null}
        </legend>
        {options.map((option, index) => (
          <FormGroup check key={index}>
            <Label check>
              <Input
                type="radio"
                name={name}
                checked={value === option.value}
                onChange={() => onChange(name, option.value)}
              />
              {" "}
              {option.content}
            </Label>
          </FormGroup>
        ))}
      </FormGroup>
    );
  }
}

export default RadioInput;
