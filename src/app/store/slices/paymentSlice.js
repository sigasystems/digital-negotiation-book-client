// src/app/store/slices/paymentSlice.js
import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentId: null,
    status: "idle", // or 'processing', 'success', 'error'
  },
  reducers: {
    setPaymentId: (state, action) => {
      state.paymentId = action.payload;
    },
    setPaymentStatus: (state, action) => {
      state.status = action.payload;
    },
    clearPayment: (state) => {
      state.paymentId = null;
      state.status = "idle";
    },
  },
});

export const { setPaymentId, setPaymentStatus, clearPayment } =
  paymentSlice.actions;

export default paymentSlice.reducer;
