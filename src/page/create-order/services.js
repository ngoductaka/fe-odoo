import { apiClient } from 'helper/request/api_client';
import { apiClientMongo } from 'helper/request/api_client_v1';

// export const createEntry = (url, body) => apiClient.post(url, body);
// // export const deleteEntry = (url, body) => apiClient.delete(url, body);

export const createEntry = (url, body) => apiClientMongo.post(url, body);
export const deleteEntry = (url, body) => apiClientMongo.delete(url, body);
export const createOrder = (body) => apiClientMongo.post(`/order`, body);
