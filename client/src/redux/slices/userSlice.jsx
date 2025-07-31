import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    logout(state) {
      state.username = null;
      state.email = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;