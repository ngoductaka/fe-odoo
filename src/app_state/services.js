import { apiClient } from 'helper/request/api_client';
import { apiClientMongo } from 'helper/request/api_client_v1';

export const authServices = {
    handleLogin: (body) => apiClientMongo.post(`user/login`, body),
    handleSignOut: (body) => apiClientMongo.post(`user/logout`, body),
    // handleLogin: (body) => apiClient.post(`login`, body),
    // handleSignOut: (body) => apiClient.post(`logout`, body),
};

export const appPermissionService = {
    requestAppUser: () => apiClient.get('/application/getuser'),
    requestAllApp: () => apiClient.get('/application'),
};

export const masterService = {
    // findAllMater: () => apiClient.get('master_all'),
    findAllMater: () => apiClientMongo.get('master/all'),
    findAllLocation: () => apiClient.get('location'),
    findItemCode: () => apiClientMongo.get('master'),
};
