import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import registerReducer from './slices/registerSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    register: registerReducer,
  },
});

export default store;