import api from "./axios";

export const menuApi = {
    getByLocation: (location) => api.get(`/menus/location/${location}`),
    getAll: () => api.get("/menus"),
    getById: (id) => api.get(`/menus/${id}`),
    create: (data) => api.post("/menus", data),
    remove: (id) => api.delete(`/menus/${id}`),
    addItem: (id, data) => api.post(`/menus/${id}/items`, data),
    updateItem: (id, itemId, data) => api.put(`/menus/${id}/items/${itemId}`, data),
    removeItem: (id, itemId) => api.delete(`/menus/${id}/items/${itemId}`),
    reorderItems: (id, orderedItemIds) => api.patch(`/menus/${id}/reorder`, { orderedItemIds }),
};
