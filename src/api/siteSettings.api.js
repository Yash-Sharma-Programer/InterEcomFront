import api from "./axios";

export const siteSettingsApi = {
    get: () => api.get("/site-settings"),
    update: (data) => api.put("/site-settings", data),
    updateLogo: (formData) => api.put("/site-settings/logo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    updateFavicon: (formData) => api.put("/site-settings/favicon", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    addBanner: (formData) => api.post("/site-settings/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    }),
    removeBanner: (bannerId) => api.delete(`/site-settings/banners/${bannerId}`),
};
