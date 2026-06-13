import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://barchasb-server.liara.run/api",
  withCredentials: true, // مهم‌ترین بخش برای ارسال کوکی
});

export default axiosClient;
