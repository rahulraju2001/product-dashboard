import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://product-dashboard-e8ca.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
