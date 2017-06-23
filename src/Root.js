import React, { Component } from "react";
import { Provider } from "react-redux";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";

import { Home, BoardDetail, BoardNew, BoardEdit, BoardList } from "./pages";

import store from "./store";

export default () => {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/adminerino"
              component={() => <BoardList isAdmin={true} />}
            />
            <Route exact path="/boards" component={BoardList} />
            <Route exact path="/boards/new" component={BoardNew} />
            <Route exact path="/boards/:id" component={BoardDetail} />
            <Route exact path="/boards/edit/:id" component={BoardEdit} />
          </Switch>
          <Container className="footer text-center">
            Created with <i className="material-icons">favorite</i> at
            {" "}
            <a href="http://hackprague.com/" target="_blank">HackPrague</a>
          </Container>
        </div>
      </Router>
    </Provider>
  );
};
