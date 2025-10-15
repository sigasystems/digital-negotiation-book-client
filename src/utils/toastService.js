// utils/toastHelper.js
import { toast } from "react-hot-toast";

const TOAST_DURATION = 4000;

export const showSuccess = (message = "Success!") => {
  toast.success(message, {
    duration: TOAST_DURATION,
    position: "top-right",
  });
};

export const showError = (message = "Something went wrong!") => {
  toast.error(message, {
    duration: TOAST_DURATION,
    position: "top-right",
  });
};

export const showInfo = (message = "Info") => {
  toast(message, {
    duration: TOAST_DURATION,
    position: "top-right",
    style: {
      background: "#f0f4ff",
      color: "#1e3a8a",
    },
  });
};

export const showLoading = (message = "Loading...") => {
  return toast.loading(message, {
    duration: TOAST_DURATION,
    position: "top-right",
  });
};

export const dismissToast = (id) => {
  toast.dismiss(id);
};
