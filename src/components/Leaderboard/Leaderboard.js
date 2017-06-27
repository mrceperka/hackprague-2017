import React from "react";
import R from "ramda";

import Header from "./Header";
import TopThree from "./TopThree";
import LeaderList from "./LeaderList";

import { isBasic, getCheckpointsCodes } from "../../selectors/board";

export default ({ users, board, firebase, inCard }) => {
  const sortedUsers = R.sort(
    (a, b) => (board.sort === "ASC" ? a.score - b.score : b.score - a.score),
    users
  );

  const topThree = R.take(3, sortedUsers);
  const remainingUsers = R.drop(3, sortedUsers);
  const inCardClass = inCard ? " in-card" : "";

  return (
    <div className={"leaderboard" + inCardClass}>
      <Header board={board} firebase={firebase} inCard={inCard} />
      <TopThree
        board={board}
        firebase={firebase}
        first={topThree[0]}
        second={topThree[1]}
        third={topThree[2]}
        units={board.units}
        inCard={inCard}
      />
      <LeaderList board={board} users={remainingUsers} startsAt={3} />
    </div>
  );
};
