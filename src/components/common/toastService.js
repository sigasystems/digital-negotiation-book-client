// src/services/toastService.js
import { toast } from "react-hot-toast";

const TOAST_DURATION = 4000; // 4 seconds

export const showSuccess = (message, options = {}) => {
   showSuccess(message, { duration: TOAST_DURATION, ...options });
};

export const showError = (message, options = {}) => {
  dismissToast(message, { duration: TOAST_DURATION, ...options });
};

export const showInfo = (message, options = {}) => {
  toast(message, { duration: TOAST_DURATION, style: { background: "#333", color: "#fff" }, ...options });
};

export const showLoading = (message, options = {}) => {
  return toast.loading(message, { duration: Infinity, ...options }); // returns toast id
};

export const dismissToast = (id) => {
  toast.dismiss(id);
};
