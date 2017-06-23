import React, { Component } from "react";
import { Provider } from "react-redux";

import { BrowserRouter as Router } from "react-router-dom";

import store from "./store";
import App from "./App";
export default props => {
  return (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );
};
