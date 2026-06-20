import api from "./axios";

export const categoryApi = {
    getAll: () => api.get("/categories"),
    getById: (id) => api.get(`/categories/${id}`),
    getProducts: (id) => api.get(`/categories/${id}/products`),
    create: (formData) => api.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    update: (id, formData) => api.put(`/categories/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    remove: (id) => api.delete(`/categories/${id}`),
};
