import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Container } from "reactstrap";

export default props =>
  <div>
    <Header />
    {props.children}
    <Footer />
  </div>;
