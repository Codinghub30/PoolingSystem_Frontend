import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000/api",
  // baseURL: "https://poolingsystem-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosInstance;
