import { apiClientMongo } from "helper/request/api_client_v1";
import { apiClient } from "../../../helper/request/api_client";
import { ENDPOINT } from "./const";

// export const get = (params) => apiClient.get(ENDPOINT, params)
// export const post = (body) => apiClient.post('/user', body)
// export const patch = (body) => apiClient.patch('/user', body)
// export const deleteMany = (params) => apiClient.delete('/user', params)

// // format form
// // http://54.169.159.150:5010/user/filter
// export const getFilterForm = (body) => apiClient.get(`${ENDPOINT}/filter`, body)
// export const getPostForm = (body) => apiClient.get(`${ENDPOINT}/post`, body)
// export const getPatchForm = (body) => apiClient.get(`${ENDPOINT}/patch`, body)
// export const getListColumn = () => apiClient.get(`${ENDPOINT}/column`)
// // 
// export const updateListColumn = (body) => apiClient.patch(`${ENDPOINT}/column`, body)

// //
// export const getErrorCode = (params) => apiClient.get("/machine_reason_code" ,params)
// export const addErrorCode = (body) => apiClient.post('/machine_reason_code' ,body)

export const get = (params) => apiClientMongo.get(ENDPOINT, params)
export const post = (body) => apiClientMongo.post('/user', body)
export const patch = (body) => apiClientMongo.patch('/user', body)
export const deleteMany = (params) => apiClientMongo.delete('/user', params)

// format form
// http://54.169.159.150:5010/user/filter
export const getFilterForm = (body) => apiClientMongo.get(`${ENDPOINT}/filter`, body)
export const getPostForm = (body) => apiClientMongo.get(`${ENDPOINT}/post`, body)
export const getPatchForm = (body) => apiClientMongo.get(`${ENDPOINT}/patch`, body)
export const getListColumn = () => apiClientMongo.get(`${ENDPOINT}/column`)
// 
export const updateListColumn = (body) => apiClientMongo.patch(`${ENDPOINT}/column`, body)

//
export const getErrorCode = (params) => apiClientMongo.get("/machine_reason_code" ,params)
export const addErrorCode = (body) => apiClientMongo.post('/machine_reason_code' ,body)
