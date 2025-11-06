import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isRefreshing = false;
let refreshPromise = null;

// Attach Authorization header
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }
    if (
      error.response.status === 403 &&
      error.response.data?.message === "Invalid or expired access token"
    ) {
      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;

          const refreshToken = sessionStorage.getItem("refreshToken");

          if (!refreshToken) throw new Error("Missing refresh token");

          refreshPromise = apiClient.post("/auth/refresh-token", {
            refreshToken,
          });
        }

        const refreshResponse = await refreshPromise;

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        const newRefreshToken = refreshResponse.data?.data?.refreshToken;

        if (newAccessToken) {
          sessionStorage.setItem("authToken", newAccessToken);
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          apiClient.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        if (newRefreshToken) {
          sessionStorage.setItem("refreshToken", newRefreshToken);
        }

        return apiClient(originalRequest);
      } catch (err) {
        console.error("Refresh failed", err);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);


export default apiClient;
