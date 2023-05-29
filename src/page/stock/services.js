import { apiClient } from 'helper/request/api_client';

export const updateLocation = (body) => apiClient.patch('location', body);
