import axios from "axios";

const API_URL = "http://localhost:8080";

// Create an axios instance
const baseURL = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Add a request interceptor to attach the JWT token
baseURL.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling token validation errors
baseURL.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //TODO: use alert..
      console.log("Token is invalid or expired. Please login again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default baseURL;
