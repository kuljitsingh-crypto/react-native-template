import { resetHomeState } from "../Home/homeSlice";
import { screenNames } from "../screenNames";

export const resetReduxState = {
  [screenNames.home]: resetHomeState,
};

export type ResetReduxState =
  (typeof resetReduxState)[keyof typeof resetReduxState];

export type ResetReduxStatekey = keyof typeof resetReduxState;
