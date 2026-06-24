import api from "./axios";

export const authApi = {
    register: (data) => api.post("/signin", data),
    login: (data) => api.post("/login", data),
    adminLogin: (data) => api.post("/adminlogin", data),
    logout: () => api.post("/logout"),
    getProfile: () => api.get("/profile"),
    updateProfile: (data) => api.put("/profile", data),
    forgotPassword: (data) => api.post("/forgot-password", data),
    resetPassword: (token, data) => api.post(`/reset-password/${token}`, data),
    changePassword: (data) => api.put("/change-password", data),
};
