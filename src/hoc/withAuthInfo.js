import React from "react";
import { connect } from "react-redux";

import { getState } from "../selectors/auth";
import { setId, setLoggedIn } from "../actions/auth";

export default () => Component => {
  class WithAuthInfo extends React.Component {
    render() {
      return <Component {...this.props} />;
    }
  }

  const connected = connect(
    state => ({
      authInfo: getState(state)
    }),
    {
      setId,
      setLoggedIn
    }
  )(WithAuthInfo);

  return connected;
};
