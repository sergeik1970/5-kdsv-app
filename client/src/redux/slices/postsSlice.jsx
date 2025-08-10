import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const initialState = {
  posts: [],
  post: null,
  editPost: {
    title: "",
    description: "",
    file: null
  },
  newPostTitle: "",
  newPostDescription: "",
  newPostFile: null,
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
    },
    setEditTitle: (state, action) => { state.editPost.title = action.payload },
    setEditDescription: (state, action) => { state.editPost.description = action.payload },
    setEditFile: (state, action) => { state.editPost.file = action.payload },
    setNewPostTitle: (state, action) => { state.newPostTitle = action.payload },
    setNewPostDescription: (state, action) => { state.newPostDescription = action.payload },
    setNewPostFile: (state, action) => { state.newPostFile = action.payload },
    resetNewPostForm: (state) => {
      state.newPostTitle = "";
      state.newPostDescription = "";
      state.newPostFile = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload); // добавим пост в начало списка
      })
      .addCase(createPost.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(fetchPostById.rejected, (state) => {
        state.loading = false;
      })
      .addCase(deletePostById.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
        if (state.post && state.post._id === action.payload) {
          state.post = null;
        }
      })
      .addCase(updatePostById.fulfilled, (state, action) => {
        // обновим одиночный пост
        state.post = action.payload;
        // и список, если он загружен
        const i = state.posts.findIndex(p => p._id === action.payload._id);
        if (i !== -1) state.posts[i] = action.payload;
      });
  },
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

export const createPost = createAsyncThunk(
  "posts/createPost",
  async ({ title, description, file, email, username }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${apiUrl}/create`, {
        title,
        description,
        file,
        email,
        username
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Ошибка");
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${apiUrl}/getpostbyid/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deletePostById = createAsyncThunk(
  "posts/deletePostById",
  async (id, { rejectWithValue }) => {
    try {
      console.log("🗑 Удаление поста, id:", id);
      console.log("URL:", `${apiUrl}/deletepostbyid/${id}`);

      const response = await axios.delete(`${apiUrl}/deletepostbyid/${id}`, {
        withCredentials: true, // если токен в куках
      });

      console.log("✅ Сервер ответил:", response.data);
      return id;
    } catch (error) {
      console.error("❌ Ошибка при удалении поста:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Ошибка сервера");
    }
  }
);

export const updatePostById = createAsyncThunk(
  "posts/updatePostById",
  async ({ id, title, description, file }, { rejectWithValue }) => {
    try {
      const payload = { title, description };
      if (file) payload.file = file; // отправляем только если выбран новый

      const { data } = await axios.put(`${apiUrl}/editpostbyid/${id}`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return data; // обновлённый пост
    } catch (err) {
      return rejectWithValue(err.response?.data || "Ошибка при редактировании");
    }
  }
);

export const {
  setEditDescription,
  setEditFile,
  setEditTitle,
  resetNewPostForm,
  setNewPostDescription,
  setNewPostFile,
  setNewPostTitle
} = postSlice.actions

export default postSlice.reducer;