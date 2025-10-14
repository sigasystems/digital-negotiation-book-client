import { apiClient } from "@/utils/apiClient";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
});

export const createBusinessOwner = async (payload) => {
  const response = await apiClient.post("/superadmin/create-business-owner", payload, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const getAllBusinessOwners = async ({ pageIndex = 0, pageSize = 10, withBuyers = false } = {}) => {
  const response = await apiClient.get("/superadmin/business-owners", {
    headers: getAuthHeaders(),
    withCredentials: true,
    params: { pageIndex, pageSize, withBuyers },
  });
  return response.data;
};

export const getBusinessOwnerById = async (id) => {
  const response = await apiClient.get(`/superadmin/business-owner/${id}`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const updateBusinessOwner = async (id, payload) => {
  const response = await apiClient.put(`/superadmin/business-owner/${id}`, payload, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const deactivateBusinessOwner = async (id) => {
  const response = await apiClient.patch(`/superadmin/business-owner/${id}/deactivate`, {}, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const activateBusinessOwner = async (id) => {
  const response = await apiClient.patch(`/superadmin/business-owner/${id}/activate`, {}, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const softDeleteBusinessOwner = async (id) => {
  const response = await apiClient.delete(`/superadmin/business-owner/${id}`, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};

export const reviewBusinessOwner = async (id, payload) => {
  const response = await apiClient.patch(`/superadmin/business-owner/${id}/review`, payload, {
    headers: getAuthHeaders(),
    withCredentials: true,
  });
  return response.data;
};
