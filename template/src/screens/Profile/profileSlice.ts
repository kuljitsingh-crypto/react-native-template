import { createSlice } from "@reduxjs/toolkit";
import { AppSelectorType, RootStateType } from "../../../store";
import { FETCH_STATUS, FetchStatusValues } from "../../custom-config";
import { ScreenValue, screenNames } from "../screenNames";

type ProfileState = {
  logoutStatus: FetchStatusValues;
};
const initialState: ProfileState = {
  logoutStatus: FETCH_STATUS.idle,
};

export const redirectOnLogoutSuccess = (
  selector: AppSelectorType,
  routeName?: ScreenValue
) => {
  const redirectOptions = { pathName: screenNames.home, isRepalce: true };
  const logoutStatus = selector(selectLogoutStatus);

  return {
    redirectCondition: logoutStatus === FETCH_STATUS.succeeded,
    redirectOptions,
  };
};

export const selectLogoutStatus = (state: RootStateType) =>
  state.profile.logoutStatus;

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
});

export default postSlice.reducer;
