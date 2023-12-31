import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("isLoggedIn", "true");
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userData");
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export const selectLoggedIn = (state) => state.user.user !== null;

export default userSlice.reducer;
