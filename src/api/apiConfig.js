import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosInstance;
