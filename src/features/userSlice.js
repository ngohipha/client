import { createSlice } from "@reduxjs/toolkit";

// appApi
import appApi from "../services/appApi";

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },
    resetNotifications: (state) => {
      state.notifications.forEach((obj) => {
        obj.status = "read";
      });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      appApi.endpoints.signup.matchFulfilled,
      (_, { payload }) => payload
    );
    builder.addMatcher(
      appApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
      }
    );
    // Other extraReducers for different API endpoints
  },
});

export const { loginSuccess, logout, addNotification, resetNotifications } =
  userSlice.actions;
export default userSlice.reducer;