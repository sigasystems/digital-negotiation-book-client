import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import paymentReducer from "./slices/paymentSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    payment : paymentReducer,
  },
});
