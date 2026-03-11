import axios, { AxiosHeaders, type AxiosRequestConfig } from 'axios';
import type { RemoteResponse } from '../types/response';
const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

const request = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const isApiResponse = (value: unknown): value is RemoteResponse<unknown> => {
  return typeof value === 'object' && value !== null && 'code' in value;
};

request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    const headers = AxiosHeaders.from(config.headers ?? {});
    if (token) {
      headers.set('token', token);
      config.headers = headers;
    }
    // dev环境，请求头增加标识（跳过登录接口）
    if (import.meta.env.MODE === 'development' && !config.url?.includes('/login')) {
      headers.set('rj_session_info', '{"userType":"STORE_USER","guid":"1418027513526878208","userId":17059,"orgId":124}');
    }
    return config;
  },
  error => Promise.reject(error)
);

request.interceptors.response.use(
  response => {
    const res = response.data;
    if (isApiResponse(res) && res.code !== 200) {
      return Promise.reject(new Error(res.msg || 'Request failed'));
    }
    return res;
  },
  error => Promise.reject(error)
);

export default request;

export const get = <T>(url: string, params?: unknown, config?: AxiosRequestConfig) => {
  return request({
    url,
    method: 'get',
    params,
    ...config
  }) as Promise<T>;
};

export const post = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return request({
    url,
    method: 'post',
    data,
    ...config
  }) as Promise<T>;
};

export const put = <T>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
  return request({
    url,
    method: 'put',
    data,
    ...config
  }) as Promise<T>;
};

export const del = <T>(url: string, params?: unknown, config?: AxiosRequestConfig) => {
  return request({
    url,
    method: 'delete',
    params,
    ...config
  }) as Promise<T>;
};
