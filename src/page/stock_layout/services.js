import { apiClientMongo } from "helper/request/api_client_v1"

export const ENDPOINT = 'locations';

export const get = (params) => apiClientMongo.get(ENDPOINT, params)
export const post = (body) => apiClientMongo.post(ENDPOINT, body)
export const patch = (body) => apiClientMongo.patch(ENDPOINT, body)
export const deleteMany = (params) => apiClientMongo.delete(ENDPOINT, params)

export const freeBoxMaterial = (params) => apiClientMongo.patch(`box-material/free-location`, params)
