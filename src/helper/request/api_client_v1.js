import axios from "axios";
import { createBrowserHistory } from 'history';

import { ACCESS_TOKEN, REFRESH_TOKEN, SERVER_URL } from "../../_config/storage_key";
import { AccountServer, MONGO_SERVER } from "_config/constant";
import store from '../../store';
import { requestLogout } from "../../app_state/login";

export const history = createBrowserHistory();

const request = axios.create({
  baseURL: MONGO_SERVER,
  // timeout: 20000, http://20.115.75.139/
});

// Add a request interceptor
request.interceptors.request.use(
  async (config) => {
    // console.log("request interceptor ==== ", config);
    const [access_token, urlServer] = await Promise.all([localStorage.getItem(ACCESS_TOKEN), localStorage.getItem(SERVER_URL)]);
    if (access_token)
      config.headers["Authorization"] = `Bearer ${access_token}`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Add a response interceptor
request.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    console.log("err_response_interceptor_account", error);
    const originalRequest = error?.response?.config;
    // refresh token expired
    if (
      error?.response?.status === 401 &&
      originalRequest?.url === `refresh_token`
    ) {
      store.dispatch(requestLogout())
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const apiClientMongo = {
  get: (url, data = {}) => {
    // console.log('url get: ', url, data);
    return request({
      method: "get",
      url,
      params: data,
    })
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  },
  post: (url, data) => {
    // console.log('post ', { url }, { data });
    return request({
      method: "post",
      url,
      data,
    })
      .then((response) => response)
      .catch((err) => {
        throw err;
      });
  },
  delete: (url, data, headers = {}) =>
    request({
      method: "delete",
      url,
      data,
      headers,
    })
      .then((response) => response)
      .catch((err) => {
        throw err;
      }),
  put: (url, data) =>
    request({
      method: "put",
      url,
      data,
    })
      .then((response) => response)
      .catch((err) => {
        throw err;
      }),
  patch: (url, data) =>
    request({
      method: "patch",
      url,
      data,
    })
      .then((response) => response)
      .catch((err) => {
        throw err;
      }),
};
