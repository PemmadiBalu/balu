
import axios from "axios";

// Create a reusable Axios instance for backend API calls
export const api = axios.create({
  baseURL: "http://127.0.0.1:5000" // Base URL of the Flask backend server
});
