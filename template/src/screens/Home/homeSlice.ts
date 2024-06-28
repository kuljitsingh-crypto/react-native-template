import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    resetHomeState: (state) => {
      state.posts = [];
    },
  },
});

export default homeSlice.reducer;
export const { resetHomeState } = homeSlice.actions;
