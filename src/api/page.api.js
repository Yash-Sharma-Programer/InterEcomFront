import api from "./axios";

export const pageApi = {
    getPublished: () => api.get("/pages"),
    getBySlug: (slug) => api.get(`/pages/slug/${slug}`),
    getAllAdmin: () => api.get("/pages/admin/all"),
    getByIdAdmin: (id) => api.get(`/pages/admin/${id}`),
    create: (data) => api.post("/pages", data),
    update: (id, data) => api.put(`/pages/${id}`, data),
    remove: (id) => api.delete(`/pages/${id}`),
};
