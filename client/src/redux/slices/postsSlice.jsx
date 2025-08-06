import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  posts: [],
  page: 1,
  loading: false,
  hasMore: true,
  limit: 2,
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload },
    addPosts: (state, action) => { state.posts.push(...action.payload) },
    incrementPage: (state) => { state.page += 1 },
    setHasMore: (state, action) => { state.hasMore = action.payload },
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
    }
  }
});

export const initPosts = () => async (dispatch, getState) => {
  const { posts } = getState().posts;
  if (posts.length === 0) {
    dispatch(fetchPosts());
  }
};

export const {
  setLoading, addPosts, incrementPage, setHasMore, resetPosts
} = postSlice.actions;

export const fetchPosts = () => async (dispatch, getState) => {
  const { page, hasMore, loading, limit } = getState().posts;
  if (!hasMore || loading) return;

  try {
    dispatch(setLoading(true));
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/getposts?page=${page}`);
    const data = res.data;
    dispatch(addPosts(data));
    dispatch(incrementPage());
    if (data.length < limit) dispatch(setHasMore(false));
  } catch (err) {
    console.error("Ошибка при загрузке постов:", err);
  } finally {
    dispatch(setLoading(false));
  }
};

export default postSlice.reducer;