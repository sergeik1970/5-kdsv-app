import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// localhost
const apiUrl = import.meta.env.VITE_API_URL;

// Начальное состояние
const initialState = {
  // Список всех постов
  posts: [],
  // Выбранный пост, изначально null
  post: null,
  // Данные для редактируемого поста
  editPost: {
    title: "",
    description: "",
    file: null
  },
  // Поля формы создания поста
  newPostTitle: "",
  newPostDescription: "",
  newPostFile: null,
  // Текущая страница (для загрузки постов)
  page: 1,
  // Индикатор загрузки
  loading: false,
  // Есть ли ещё посты для загрузки
  hasMore: true,
  // Саколько постов загрузить за один запрос
  limit: 2,
};

// Создаем slice с именем posts
const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setLoading: (state, action) => { state.loading = action.payload },
    // Добавляет новые посты в начало списка
    addPosts: (state, action) => { state.posts.push(...action.payload) },
    incrementPage: (state) => { state.page += 1 },
    setHasMore: (state, action) => { state.hasMore = action.payload },
    // Очищает список постов
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
        // Добавление поста в начало списка
        state.posts.unshift(action.payload);
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
        // Обновим одиночный пост
        state.post = action.payload;
        // И список, если он загружен
        const i = state.posts.findIndex(p => p._id === action.payload._id);
        if (i !== -1) state.posts[i] = action.payload;
      });
  },
});

// Если постов нет, загружаем их
export const initPosts = () => async (dispatch, getState) => {
  const { posts } = getState().posts;
  if (posts.length === 0) {
    dispatch(fetchPosts());
  }
};

export const {
  setLoading, addPosts, incrementPage, setHasMore, resetPosts
} = postSlice.actions;

// Загрузка постов постранично
export const fetchPosts = () => async (dispatch, getState) => {
  const { page, hasMore, loading, limit } = getState().posts;
  if (!hasMore || loading) return;

  try {
    dispatch(setLoading(true));
    // Получение постов с сервера
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
      // Запрос с данными
      const response = await axios.post(`${apiUrl}/create`, {
        title,
        description,
        file,
        email,
        username
      }, {
        // Сервер должен вернуть ответ в формате JSON
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

// Чтобы получить конкретный пост
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
// Чтобы удалить конкретный пост
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

// Чтобы обновить конкретный пост
export const updatePostById = createAsyncThunk(
  "posts/updatePostById",
  async ({ id, title, description, file }, { rejectWithValue }) => {
    try {
      const payload = { title, description };
      // Тольк если есть новый файл, то отправлять его
      if (file) payload.file = file;

      const { data } = await axios.put(`${apiUrl}/editpostbyid/${id}`, payload, {
        withCredentials: true,
        // Сервер должен вернуть ответ в формате JSON
        headers: { "Content-Type": "application/json" },
      });
      return data; // обновлённый пост
    } catch (err) {
      return rejectWithValue(err.response?.data || "Ошибка при редактировании");
    }
  }
);

// Экспорт экшена и редьюсера
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