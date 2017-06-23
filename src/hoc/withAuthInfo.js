import React from "react";
import { connect } from "react-redux";

import { getState } from "../selectors/user";
import { setId, setLoggedIn } from "../actions/user";

export default () => Component => {
  class WithAuthInfo extends React.Component {
    render() {
      return <Component {...this.props} />;
    }
  }

  const connected = connect(
    state => ({
      auth: getState(state)
    }),
    {
      setId,
      setLoggedIn
    }
  )(WithAuthInfo);

  return connected;
};
