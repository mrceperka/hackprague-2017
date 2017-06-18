import { AppContainer } from "react-hot-loader";
import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root";

import "toastr/build/toastr.min.css";
window.toastr = require("toastr/build/toastr.min.js");
window.toastr.options.timeOut = 60;
window.toastr.options.extendedTimeOut = 100;

import "bootstrap/dist/css/bootstrap.css";
import "./theme/main.less";

const rootEl = document.getElementById("root");
const render = Component =>
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    rootEl
  );

render(Root);
if (module.hot) module.hot.accept("./Root", () => render(Root));
