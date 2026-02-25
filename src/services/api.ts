import axios from "axios";

const BASE_URL = "https://ecommerce.routemisr.com";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.token = token;
  }
  return config;
});

// Auth
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; rePassword: string; phone: string }) =>
    api.post("/api/v1/auth/signup", data),
  signin: (data: { email: string; password: string }) =>
    api.post("/api/v1/auth/signin", data),
  forgotPassword: (data: { email: string }) =>
    api.post("/api/v1/auth/forgotPasswords", data),
  verifyResetCode: (data: { resetCode: string }) =>
    api.post("/api/v1/auth/verifyResetCode", data),
  resetPassword: (data: { email: string; newPassword: string }) =>
    api.put("/api/v1/auth/resetPassword", data),
  changePassword: (data: { currentPassword: string; password: string; rePassword: string }) =>
    api.put("/api/v1/users/changeMyPassword", data),
  verifyToken: () => api.get("/api/v1/auth/verifyToken"),
};

// Products
export const productsAPI = {
  getAll: (params?: Record<string, string | number>) =>
    api.get("/api/v1/products", { params }),
  getById: (id: string) => api.get(`/api/v1/products/${id}`),
};

// Categories
export const categoriesAPI = {
  getAll: () => api.get("/api/v1/categories"),
  getById: (id: string) => api.get(`/api/v1/categories/${id}`),
  getSubCategories: (id: string) => api.get(`/api/v1/categories/${id}/subcategories`),
};

// Brands
export const brandsAPI = {
  getAll: () => api.get("/api/v1/brands"),
  getById: (id: string) => api.get(`/api/v1/brands/${id}`),
};

// Cart
export const cartAPI = {
  get: () => api.get("/api/v1/cart"),
  add: (productId: string) => api.post("/api/v1/cart", { productId }),
  update: (productId: string, count: number) =>
    api.put(`/api/v1/cart/${productId}`, { count: String(count) }),
  remove: (productId: string) => api.delete(`/api/v1/cart/${productId}`),
  clear: () => api.delete("/api/v1/cart"),
};

// Wishlist
export const wishlistAPI = {
  get: () => api.get("/api/v1/wishlist"),
  add: (productId: string) => api.post("/api/v1/wishlist", { productId }),
  remove: (productId: string) => api.delete(`/api/v1/wishlist/${productId}`),
};

// Addresses
export const addressesAPI = {
  getAll: () => api.get("/api/v1/addresses"),
  add: (data: { name: string; details: string; phone: string; city: string }) =>
    api.post("/api/v1/addresses", data),
  remove: (id: string) => api.delete(`/api/v1/addresses/${id}`),
};

// Orders
export const ordersAPI = {
  getUserOrders: (userId: string) => api.get(`/api/v1/orders/user/${userId}`),
  createCashOrder: (cartId: string, shippingAddress: { details: string; phone: string; city: string }) =>
    api.post(`/api/v1/orders/${cartId}`, { shippingAddress }),
  checkoutSession: (cartId: string, url: string) =>
    api.post(`/api/v1/orders/checkout-session/${cartId}?url=${url}`, {
      shippingAddress: { details: "online", phone: "000", city: "online" },
    }),
};

export default api;
