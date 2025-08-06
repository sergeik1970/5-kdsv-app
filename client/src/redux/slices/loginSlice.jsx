// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { setUser } from "./userSlice";

// const initialState = {
//   email: "",
//   password: ""
// };

// const loginSlice = createSlice({
//   name: "login",
//   initialState,
//   reducers: {
//     setEmail: (state, action) => {
//       state.email = action.payload;
//     },
//     setPassword: (state, action) => {
//       state.password = action.payload;
//     },
//     resetLogin: () => initialState
//   }
// });

// export const { setEmail, setPassword, resetLogin } = loginSlice.actions;
// export default loginSlice.reducer;

// src/redux/slices/loginSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setUser } from './userSlice';

const apiUrl = import.meta.env.VITE_API_URL;

// 🎯 Асинхронный thunk для входа
export const loginUser = createAsyncThunk(
  'login/loginUser',
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axios.post(
        `${apiUrl}/login`,
        { email, password },
        { withCredentials: true }
      );

      if (res.data.username) {
        dispatch(setUser(res.data));
        return res.data;
      } else {
        return rejectWithValue("Неверный логин или пароль");
      }
    } catch (err) {
      console.error("Ошибка при входе:", err);
      return rejectWithValue("Ошибка при входе");
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState: {
    email: '',
    password: '',
    loading: false,
    error: null,
  },
  reducers: {
    setEmail: (state, action) => { state.email = action.payload },
    setPassword: (state, action) => { state.password = action.payload }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setEmail, setPassword, resetLogin } = loginSlice.actions;

export default loginSlice.reducer;
