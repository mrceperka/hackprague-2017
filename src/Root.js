import React, { Component } from "react";
import { Provider } from "react-redux";

import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import Home from "./pages/home";
import Boards from "./pages/boards";
import NewBoard from "./pages/boards/new";
import EditBoard from "./pages/boards/edit";
import BoardDetail from "./pages/boards/detail";

import AppHeader from "./components/AppHeader";

import store from "./store";

export default () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <AppHeader>
            <Link to="/">Home</Link>
            <Link to="/boards">Boards</Link>
          </AppHeader>
          <Container>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/boards" component={Boards} />
              <Route exact path="/boards/new" component={NewBoard} />
              <Route exact path="/boards/edit/:id" component={EditBoard} />
              <Route exact path="/boards/:id" component={BoardDetail} />
            </Switch>
          </Container>
        </div>
      </Router>
    </Provider>
  );
};
