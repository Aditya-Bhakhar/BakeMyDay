import { refreshAccessToken } from "@/services/user.service";
import axios from "axios";

const baseURL =
  import.meta.env.VITE_ENV == "dev"
    ? import.meta.env.VITE_LOCAL_BASE_URL
    : import.meta.env.VITE_BASE_URL;

export const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const authState = localStorage.getItem("authState")
      ? JSON.parse(localStorage.getItem("authState"))
      : null;
    if (authState?.accessToken) {
      config.headers.Authorization = `Bearer ${authState.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // console.error(error);

    const originalRequest = error.config;

    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authState = localStorage.getItem("authState");
        if (authState) {
          const { refreshToken } = JSON.parse(authState);
          const { accessToken: newAccessToken } = await refreshAccessToken({
            refreshToken,
          });

          const updatedAuthState = {
            ...JSON.parse(authState),
            accessToken: newAccessToken,
          };

          localStorage.setItem("authState", JSON.stringify(updatedAuthState));

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error("ERROR :: refresh token failed :: ", err);
        localStorage.removeItem("authState");
        window.location.href = "/user/login";
      }
    }
    return Promise.reject(error);
  }
);
