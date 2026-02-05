
import axios from "axios";

// Create a reusable Axios instance for backend API calls
export const api = axios.create({
  baseURL: "https://balu-4rog.onrender.com" // Base URL of the Flask backend server
});
