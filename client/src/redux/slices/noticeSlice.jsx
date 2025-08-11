import { createSlice } from "@reduxjs/toolkit";

// Создаем slice с именем notice
const noticeSlice = createSlice({
  name: "notice",
  // Начальное состояние
  initialState: {
    // Изначально оно показывается
    showNotice: true,
  },
  // Редьюсеры
  reducers: {
    // Скрываем notice
    hideNotice: (state) => {
      state.showNotice = false;
    },
    // Показываем notice снова
    showNoticeAgain: (state) => {
      state.showNotice = true;
    },
  },
});

export const { hideNotice, showNoticeAgain } = noticeSlice.actions;
export default noticeSlice.reducer;
