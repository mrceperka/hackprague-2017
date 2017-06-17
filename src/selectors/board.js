import R from "ramda";

export const getUsers = board =>
  R.keys(board.users).map(id => ({
    ...board.users[id],
    id
  }));
