import { toast } from "react-hot-toast";

export const runAction = async ({
  key,
  fn,
  setLoading,
  refresh,
  getErrorMessage,
  onSuccess,
  onError,
}) => {
  try {
    setLoading?.(key);
    const result = await fn();
    
    if (onSuccess) {
      onSuccess(result);
    } else {
      toast.success("Operation completed successfully");
    }
    
    refresh?.();
    return result;
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      toast.error(getErrorMessage?.(error) || "Operation failed");
    }
    throw error;
  } finally {
    setLoading?.(null);
  }
};

export const getErrorMessage = (err, fallback = "Something went wrong") =>
  err?.response?.data?.message || err?.message || fallback;
