import R from "ramda";

export const getUsers = board =>
  R.keys(board.users).map(id => ({
    ...board.users[id],
    id
  }));

export const getCheckpoints = board =>
  R.keys(board.checkpoints).map(id => ({
    ...board.checkpoints[id],
    id
  }));

export const isBasic = board => getCheckpoints(board).length === 0;
export const getCheckpointsCodes = board =>
  R.map(chp => chp.id, getCheckpoints(board));
