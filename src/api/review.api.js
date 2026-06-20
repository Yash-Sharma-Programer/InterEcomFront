import api from "./axios";

export const reviewApi = {
    getForProduct: (productId) => api.get(`/reviews/product/${productId}`),
    submit: (data) => api.post("/reviews", data),
    getAll: (params) => api.get("/reviews", { params }),
    updateStatus: (id, status) => api.patch(`/reviews/${id}/status`, { status }),
    remove: (id) => api.delete(`/reviews/${id}`),
};
