import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import R from "ramda";
import { lifecycle } from "recompose";
import { Container } from "reactstrap";
import { Cookies } from "react-cookie";

import withAuthInfo from "./hoc/withAuthInfo";
import Home from "./pages/home";
import Boards from "./pages/boards";
import NewBoard from "./pages/boards/new";
import EditBoard from "./pages/boards/edit";
import BoardDetail from "./pages/boards/detail";
import { AUTH_COOKIE_NAME } from "./constants";

const App = () =>
  <div>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route
        exact
        path="/adminerino"
        component={() => <Boards isAdmin={true} />}
      />
      <Route exact path="/boards" component={Boards} />
      <Route exact path="/boards/new" component={NewBoard} />
      <Route exact path="/boards/:id" component={BoardDetail} />
      <Route exact path="/boards/edit/:id" component={EditBoard} />
    </Switch>
    <Container className="footer text-center">
      Created with <i className="material-icons">favorite</i> at
      {" "}
      <a href="http://hackprague.com/" target="_blank">HackPrague</a>
    </Container>
  </div>;

export default R.compose(
  withAuthInfo(),
  lifecycle({
    componentDidMount() {
      const { setLoggedIn, setId } = this.props;
      if (typeof document !== "undefined") {
        const cks = new Cookies();
        const cookie = cks.get(AUTH_COOKIE_NAME);
        if (cookie) {
          setLoggedIn(true);
          setId(cookie);
        } else {
          setLoggedIn(false);
        }
      }
    }
  })
)(App);
