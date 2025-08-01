import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import registerReducer from './slices/registerSlice';
import loginReducer from './slices/loginSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    register: registerReducer,
    login: loginReducer,
  },
});

export default store;