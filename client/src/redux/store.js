import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import registerReducer from './slices/registerSlice';
import loginReducer from './slices/loginSlice';
import postReducer from './slices/postsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    register: registerReducer,
    login: loginReducer,
    posts: postReducer,
  },
});

export default store;