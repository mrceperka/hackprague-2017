import React, { Component } from "react";
import { Provider } from "react-redux";

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import Home from "./pages/home";
import Boards from "./pages/boards";
import NewBoard from "./pages/boards/new";
import BoardDetail from "./pages/boards/detail";

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
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/boards" component={Boards} />
              <Route exact path="/boards/new" component={NewBoard} />
              <Route exact path="/boards/:id" component={BoardDetail} />
            </Switch>
          </div>
        </div>
      </Router>
    </Provider>
  );
};
