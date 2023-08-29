import { createSlice } from "@reduxjs/toolkit";

//appApi
import appApi from "../services/appApi";

const initialState = [];

export const debttSlice = createSlice({
  name: "debts",
  initialState,
  reducers: {
    // updateProducts: (_,action) => {
    //   return action.payload;
    // }
  },
  extraReducers : (builder) => {
    builder.addMatcher(appApi.endpoints.createDebts.matchFulfilled,(_,{payload})=> payload)
    
  }
});

// export const {updateProducts} = debttSlice.actions;
export default debttSlice.reducer;