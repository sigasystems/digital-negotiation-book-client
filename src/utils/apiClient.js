import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise = null;

// Attach auth token automatically to every request
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip if no response or already retried
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }
    // Handle expired token
    if (
      error.response.data.statusCode === 403 &&
      error.response.data?.message === "Invalid or expired access token"
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = apiClient.post("/auth/refresh-token", {}, { withCredentials: true });
        }

        const refreshResponse = await refreshPromise;

        const newAccessToken = refreshResponse.data?.data?.accessToken?.accessToken;
        const safeUserInfo = refreshResponse.data?.data?.accessToken?.safeUserInfo;

        if (newAccessToken) {
          sessionStorage.setItem("authToken", newAccessToken);
          apiClient.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        if (safeUserInfo) {
          sessionStorage.setItem("user", JSON.stringify(safeUserInfo));
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);


export default apiClient;
