import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: ""
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    resetLogin: () => initialState
  }
});

export const { setEmail, setPassword, resetLogin } = loginSlice.actions;
export default loginSlice.reducer;