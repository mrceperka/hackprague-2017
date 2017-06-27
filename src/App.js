import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import R from "ramda";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { lifecycle } from "recompose";
import { Container } from "reactstrap";

import Layout from "./components/Layout";
import withAuthInfo from "./hoc/withAuthInfo";
import { Home, BoardDetail, BoardNew, BoardEdit, BoardList } from "./pages";
import { AUTH_COOKIE_NAME } from "./constants";
import { startApp } from "./actions/app";

const App = props =>
  <Router>
    <Layout>
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
    </Layout>
  </Router>;

export default R.compose(
  firebaseConnect(),
  withAuthInfo(),
  connect(null, { startApp }),
  lifecycle({
    componentDidMount() {
      const { startApp } = this.props;
      startApp();
    }
  })
)(App);
