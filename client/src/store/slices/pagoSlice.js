import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metodoSeleccionado: null,
};

const pagoSlice = createSlice({
  name: 'pago',
  initialState,
  reducers: {
    seleccionarMetodoDePago: (state, action) => {
      state.metodoSeleccionado = action.payload;
    },
    limpiarMetodoDePago: (state) => {
      state.metodoSeleccionado = null;
    },
  },
});

export const { seleccionarMetodoDePago, limpiarMetodoDePago } = pagoSlice.actions;
export default pagoSlice.reducer;