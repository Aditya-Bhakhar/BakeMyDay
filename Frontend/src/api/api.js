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
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
    //   window.location.href = "/user/login";
    }
    return Promise.reject(error);
  }
);
