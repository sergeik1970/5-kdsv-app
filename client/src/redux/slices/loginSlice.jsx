import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setUser } from './userSlice';
// Localhost
const apiUrl = import.meta.env.VITE_API_URL;

// Создаём thunk с именем loginUser для входа
export const loginUser = createAsyncThunk(
  'login/loginUser',
  // Асинхронная функция, которая принимает email и пароль, также объект с методами Redux Toolkit
  // rejectWithValue чтобы вернуть ошибку в rejected
  // dispatch чтобы отправлять другие экшены отсюда
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      // Отправляем запрос на сервер
      const res = await axios.post(
        `${apiUrl}/login`,
        // Передаем email и пароль
        { email, password },
        { withCredentials: true }
      );

      // Если сервер вернул username, значит вход успешен
      if (res.data.username) {
        // Отправляем данные в userSlice, чтобы сохранить данные пользователя
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

// Создаём slice с именем login
const loginSlice = createSlice({
  name: 'login',
  // Начальное состояние формы логина
  initialState: {
    email: '',
    password: '',
    loading: false,
    error: null,
  },
  // Обычные синхронные редьюсеры
  reducers: {
    // Меняет state на переданное значение
    setEmail: (state, action) => { state.email = action.payload },
    setPassword: (state, action) => { state.password = action.payload }
  },
  extraReducers: (builder) => {
    builder
    // Запрос начался, включаем загрузку, убираем ошибки
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Вход успешен, выключаем загрузку, убираем ошибки
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      // Вход не удался, выключаем загрузку, сохраняем ошибки
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Экспортируем экшены для изменения state формы и редьюсер
export const { setEmail, setPassword } = loginSlice.actions;

export default loginSlice.reducer;
