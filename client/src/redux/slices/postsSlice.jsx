import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (page, thunkAPI) => {
    const res = await axios.get(`${apiUrl}/posts?page=${page}`);
    return res.data;
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    page: 1,
    loading: false,
    hasMore: true,
    error: null,
  },
  reducers: {
    resetPosts: (state) => {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.length === 0) {
          state.hasMore = false;
        } else {
          state.items = [...state.items, ...action.payload];
          state.page += 1;
        }
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetPosts } = postsSlice.actions;
export default postsSlice.reducer;