import React from "react";
export default props =>
  <div className="loading">
    {props.children == null ? "Gettin' da stuff" : props.children}
  </div>;
