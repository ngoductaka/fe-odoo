import { apiClientMongo } from "helper/request/api_client_v1";
import { apiClient } from "../../../helper/request/api_client";
import { ENDPOINT } from "./const";

export const get = (params) => apiClientMongo.get(ENDPOINT, params)
export const post = (body) => apiClientMongo.post(ENDPOINT, body)
export const patch = (body) => apiClientMongo.patch(ENDPOINT, body)
export const deleteMany = (params) => apiClientMongo.delete(ENDPOINT, params)

// format form
// http://54.169.159.150:5010/user/filter
export const getFilterForm = (body) => apiClient.get(`${ENDPOINT}/filter`, body)
export const getPostForm = (body) => apiClient.get(`${ENDPOINT}/post`, body)
export const getPatchForm = (body) => apiClient.get(`${ENDPOINT}/patch`, body)
export const getListColumn = () => apiClient.get(`${ENDPOINT}/column`)
// 
export const updateListColumn = (body) => apiClient.patch(`${ENDPOINT}/column`, body)

//
export const getErrorCode = (params) => apiClient.get("/machine_reason_code" ,params)
export const addErrorCode = (body) => apiClient.post('/machine_reason_code' ,body)
