import { apiClient } from 'helper/request/api_client';
import { apiClientMongo } from 'helper/request/api_client_v1';

export const findAllEntry = (filter) => apiClient.get("master", filter);
export const updateEntry = (body) => apiClient.patch("master", body);
export const deleteEntry = (body) => apiClient.delete("master", body);

export const getPatchForm = (body) => apiClient.get("box-material/patch", body)
export const updateBoxItem = (body) => apiClientMongo.patch("box-material", body)