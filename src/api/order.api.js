import api from "./axios";

export const orderApi = {
    place: (data) => api.post("/orders", data),
    getAll: (params) => api.get("/orders", { params }),
    getById: (id) => api.get(`/orders/${id}`),
    getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
    updatePaymentStatus: (id, paymentStatus) => api.patch(`/orders/${id}/payment`, { paymentStatus }),
};
