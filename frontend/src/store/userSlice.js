import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = { list: [], status: 'idle', error: null };

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    invoiceAdded: {
      prepare(data) { return { payload: { id: nanoid(), ...data } }; },
      reducer(state, action) { state.list.push(action.payload); }
    },
    invoiceUpdated(state, action) {
      const i = state.list.findIndex(x => x.id === action.payload.id);
      if (i !== -1) state.list[i] = { ...state.list[i], ...action.payload };
    },
    invoiceRemoved(state, action) {
      state.list = state.list.filter(x => x.id !== action.payload);
    }
  }
});

export const { invoiceAdded, invoiceUpdated, invoiceRemoved } = invoicesSlice.actions;
export default invoicesSlice.reducer;
