// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   username: "",
//   email: "",
//   password: ""
// };

// const registerSlice = createSlice({
//   name: "register",
//   initialState,
//   reducers: {
//     setUsername: (state, action) => {
//       state.username = action.payload;
//     },
//     setEmail: (state, action) => {
//       state.email = action.payload;
//     },
//     setPassword: (state, action) => {
//       state.password = action.payload;
//     },
//     resetRegister: () => initialState
//   }
// });

// export const { setUsername, setEmail, setPassword, resetRegister } = registerSlice.actions;
// export default registerSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const registerUser = createAsyncThunk(
  "register/registerUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${apiUrl}/register`,
        { username, email, password },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Ошибка регистрации");
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState: {
    username: "",
    email: "",
    password: "",
    loading: false,
    error: null,
  },
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
    resetRegister: (state) => {
      state.username = "";
      state.email = "";
      state.password = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUsername, setEmail, setPassword, resetRegister } = registerSlice.actions;
export default registerSlice.reducer;