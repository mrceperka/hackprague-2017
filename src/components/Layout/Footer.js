import React from "react";
import { Container } from "reactstrap";

export default () =>
  <Container className="footer text-center">
    Created with <i className="material-icons">favorite</i> at
    {" "}
    <a href="http://hackprague.com/" target="_blank">HackPrague</a>
  </Container>;
