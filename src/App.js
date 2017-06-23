import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import R from "ramda";
import { lifecycle } from "recompose";
import { Container } from "reactstrap";
import { Cookies } from "react-cookie";

import Layout from "./components/Layout";
import withAuthInfo from "./hoc/withAuthInfo";
import { Home, BoardDetail, BoardNew, BoardEdit, BoardList } from "./pages";
import { AUTH_COOKIE_NAME } from "./constants";

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
  withAuthInfo(),
  lifecycle({
    componentDidMount() {
      const { setLoggedIn, setId } = this.props;

      if (typeof document !== "undefined") {
        const cks = new Cookies();
        const cookie = cks.get(AUTH_COOKIE_NAME);
        if (cookie) {
          // TODO, request firebase
          setLoggedIn(true);
          setId(cookie);
        } else {
          setLoggedIn(false);
        }
      }
    }
  })
)(App);
