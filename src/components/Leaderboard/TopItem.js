import React from "react";
import R from "ramda";
import { Col } from "reactstrap";
import { isBasic, getCheckpointsCodes } from "../../selectors/board";

export default ({ user, src, pos, board, inCard }) => {
  const boardCheckpointIds = getCheckpointsCodes(board);
  const units = board.units;
  return (
    <Col
      title={user.name}
      xs={4}
      className={"text-center top-item top-item" + pos}
    >
      <img src={src} />
      <h4 style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
        {user.name}
      </h4>
      <p>
        {isBasic(board) || inCard
          ? <span>{user.score} {units}</span>
          : <span>
              {
                R.intersection(
                  user.__do_not_checkpoints_codes,
                  boardCheckpointIds
                ).length
              }
              /
              {boardCheckpointIds.length}
              {" "}
              ({user.score} {board.units})
            </span>}
      </p>
      <div className={"pod pod" + pos}>
        {pos}
      </div>
    </Col>
  );
};
