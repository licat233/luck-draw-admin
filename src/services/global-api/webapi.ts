import { request } from '@umijs/max';

//skipErrorHandler: true


//核心请求方法
const baseRequest = async function <Type>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: any, options?: { [key: string]: any }) {
  return request<Type>(url, {
    method: method,
    data: body,
    ...(options || {}),
  });
}

export const webapi = {
  get: async function <Type>(url: string, body?: any, options?: { [key: string]: any }) {
    return baseRequest<Type>('GET', url, body, options)
  },
  post: async function <Type>(url: string, body?: any, options?: { [key: string]: any }) {
    return baseRequest<Type>('POST', url, body, options)
  },
  put: async function <Type>(url: string, body?: any, options?: { [key: string]: any }) {
    return baseRequest<Type>('PUT', url, body, options)
  },
  delete: async function <Type>(url: string, body?: any, options?: { [key: string]: any }) {
    return baseRequest<Type>('PUT', url, body, options)
  },
  request: baseRequest,
}
