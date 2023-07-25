import axios from "axios";
import { notification } from "antd";
import { createBrowserHistory } from 'history';
import { AccountServer, RPC_PROXY } from "_config/constant";


export const history = createBrowserHistory();

const request = axios.create({
  baseURL: RPC_PROXY,
});

export const apiRPC = {
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
  call: (data) => {
    const id = localStorage.getItem('odoo_id');
    if (!id) {
      window.location.href = window.origin + '/login';
    }
    return request({
      method: "post",
      url: `/api/${id}`,
      data,
    })
      .then((response) => response)
      .catch((err) => {
        notification.error({
          message: "Error",
          description: err.message,
        });
        window.location.href = window.origin + '/login';
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
