import React from "react";
import R from "ramda";
import { isBasic, getCheckpointsCodes } from "../../selectors/board";
import { ListGroup, ListGroupItem } from "reactstrap";

export default ({ board, users, startsAt }) => {
  const boardCheckpointIds = getCheckpointsCodes(board);
  return (
    <ListGroup>
      {users.map((user, i) => {
        return (
          <ListGroupItem key={i} className="justify-content-between">
            <div style={{ position: "relative" }}>
              <img
                style={{ width: 40 }}
                src={"/static/avatars/" + (i % 7 + 1) + ".png"}
              />
              <div
                className="badge badge-default rounded-circle"
                style={{ position: "absolute", bottom: -5, left: 0 }}
              >
                {startsAt + i + 1}
              </div>
            </div>
            <div>
              {user.name}
            </div>
            <div>
              {isBasic(board)
                ? <span>
                    {user.score} {board.units}
                  </span>
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
            </div>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
};
