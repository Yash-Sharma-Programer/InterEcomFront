import axios from "axios";

// Single source of truth for the backend URL. Change this one line (or set
// VITE_API_URL in a .env file) to point the whole app at a different backend.
export const API_BASE_URL = 'https://ecom-backend-ovxs.vercel.app'

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Attach the JWT from localStorage as a fallback for environments where
// third-party cookies are blocked (common on mobile browsers / some PWAs).
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
