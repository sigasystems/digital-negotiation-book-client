import { toast } from "react-hot-toast";
import { ACTION_LOADING_MESSAGES } from "@/app/config/actionConfig";

export const runAction = async ({
  key,
  fn,
  setLoading,
  refresh,
  getErrorMessage,
}) => {
  setLoading(key);
  const toastId = toast.loading(ACTION_LOADING_MESSAGES[key] || "Processing...");

  try {
    await new Promise((r) => setTimeout(r, 2000));
    await fn();

    toast.success("Action completed", { id: toastId });
    refresh?.();
  } catch (err) {
    const msg = getErrorMessage(err, "Action failed");
    toast.error(msg, { id: toastId });
  } finally {
    setLoading(null);
  }
};

export const getErrorMessage = (err, fallback = "Something went wrong") =>
  err?.response?.data?.message || err?.message || fallback;
