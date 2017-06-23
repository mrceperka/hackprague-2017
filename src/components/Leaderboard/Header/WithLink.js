import React from "react";
import { Link } from "react-router-dom";
import WithoutLink from "./WithoutLink";
export default ({ board }) => {
  return (
    <Link to={"/boards/" + board.public_code}>
      <WithoutLink board={board} />
    </Link>
  );
};
