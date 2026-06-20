import api from "./axios";

export const userApi = {
    getAll: (params) => api.get("/users", { params }),
    getById: (id) => api.get(`/users/${id}`),
    toggleBlock: (id) => api.patch(`/users/${id}/block`),
    remove: (id) => api.delete(`/users/${id}`),
    addAddress: (data) => api.post("/users/me/addresses", data),
    deleteAddress: (addressId) => api.delete(`/users/me/addresses/${addressId}`),
    getWishlist: () => api.get("/users/me/wishlist"),
    toggleWishlist: (productId) => api.post("/users/me/wishlist/toggle", { productId }),
};
