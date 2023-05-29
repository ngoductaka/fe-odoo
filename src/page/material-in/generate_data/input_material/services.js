import { apiClient } from 'helper/request/api_client';
import { apiClientMongo } from 'helper/request/api_client_v1';

export const findAllEntry = (filter) => apiClient.get("master", filter);
export const updateEntry = (body) => apiClient.patch("master", body);
export const deleteEntry = (body) => apiClient.delete("master", body);

export const listMasterData = () => apiClientMongo.get("master");
export const createBundles = (body) => apiClientMongo.post("material/bundle", body);

export const createMaterial = (body) => apiClientMongo.post("material", body);
export const createBoxes = (body) => apiClientMongo.post("box-material", body);
