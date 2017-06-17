import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";

import App from "./containers/App";

export default () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
