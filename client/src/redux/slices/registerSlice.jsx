import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  email: "",
  password: ""
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setUsername: (state, action) => {
      state.username = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    resetRegister: () => initialState
  }
});

export const { setUsername, setEmail, setPassword, resetRegister } = registerSlice.actions;
export default registerSlice.reducer;