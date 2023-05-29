import { apiClientMongo } from "helper/request/api_client_v1";
import { apiClient } from "../../../helper/request/api_client";
import { ENDPOINT } from "./const";

export const get = (params) => apiClientMongo.get('/role', params)
export const post = (body) => apiClientMongo.post('/role', body)
export const patch = (body) => apiClientMongo.patch('/role', body)
export const deleteMany = (params) => apiClientMongo.delete('/role', params)

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
