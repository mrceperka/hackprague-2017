import React from "react";
import WithLink from "./WithLink";
import WithoutLink from "./WithoutLink";

export default ({ board, inCard }) =>
  inCard ? <WithLink board={board} /> : <WithoutLink board={board} />;
