import { createSlice } from "@reduxjs/toolkit";

const noticeSlice = createSlice({
  name: "notice",
  initialState: {
    showNotice: true,
  },
  reducers: {
    hideNotice: (state) => {
      state.showNotice = false;
    },
    showNoticeAgain: (state) => {
      state.showNotice = true;
    },
  },
});

export const { hideNotice, showNoticeAgain } = noticeSlice.actions;
export default noticeSlice.reducer;
