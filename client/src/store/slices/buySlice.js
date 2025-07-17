import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  buyId: null,
};

const buySlice = createSlice({
  name: 'buy',
  initialState,
  reducers: {
    setBuyId: (state, action) => {
      state.buyId = action.payload;
    },
    clearBuyId: (state) => {
      state.buyId = null;
    },
  },
});

export const { setBuyId, clearBuyId } = buySlice.actions;
export default buySlice.reducer;