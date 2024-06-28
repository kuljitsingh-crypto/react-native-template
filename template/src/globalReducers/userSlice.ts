import { createSlice } from "@reduxjs/toolkit";
import { RootStateType } from "../../store";

const initialState = {
  isAuthenticated: false,
  currentUser: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
});

export const selectIsAuthenticated = (state: RootStateType) =>
  state.user.isAuthenticated;

export default userSlice.reducer;
