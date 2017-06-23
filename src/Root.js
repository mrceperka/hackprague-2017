import React, { Component } from "react";
import { Provider } from "react-redux";

import store from "./store";
import App from "./App";

export default props => {
  return (
    <Provider store={store}>
      <App {...props} />
    </Provider>
  );
};
