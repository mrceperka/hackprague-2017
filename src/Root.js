import React, { Component } from "react";
import { Provider } from "react-redux";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from "./pages/home";
import Boards from "./pages/boards";
import store from "./store";

export default () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <div>
            <Link to="/">Home</Link>
            <Link to="/boards">Boards</Link>
          </div>
          <div>
            <Route exact path="/" component={Home} />
            <Route exact path="/boards" component={Boards} />
          </div>
        </div>
      </Router>
    </Provider>
  );
};
