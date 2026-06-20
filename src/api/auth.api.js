import api from "./axios";

export const authApi = {
    register: (data) => api.post("/signin", data),
    login: (data) => api.post("/login", data),
    adminLogin: (data) => api.post("/adminlogin", data),
    logout: () => api.post("/logout"),
    getProfile: () => api.get("/profile"),
    updateProfile: (data) => api.put("/profile", data),
};
