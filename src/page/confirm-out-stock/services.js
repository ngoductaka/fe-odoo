import { apiClient } from 'helper/request/api_client';

export const findAllEntry = (filter) => apiClient.get("master", filter);
export const updateEntry = (body) => apiClient.patch("master", body);
export const deleteEntry = (body) => apiClient.delete("master", body);
