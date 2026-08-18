
import axiosInstance from "../api/axiosInstance";

//Products
export const getProducts = () => axiosInstance.get("/products");

export const getProduct = (id) =>
  axiosInstance.get(`/products/${id}`);

export const createProduct = (product) =>
  axiosInstance.post("/products", product);

export const updateProduct = (id, product) =>
  axiosInstance.put(`/products/${id}`, product);

export const deleteProduct = (id) =>
  axiosInstance.delete(`/products/${id}`);

//Orders
export const getOrders = () => axiosInstance.get("/orders");

export const getOrder = (id) =>
  axiosInstance.get(`/orders/${id}`);