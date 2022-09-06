import { request } from '@umijs/max';

//skipErrorHandler: true


// 核心请求方法
const baseRequest = async function <Type>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, body?: any, options?: { [key: string]: any }) {
  // const skipErrorHandler = options && options.skipErrorHandler
  // 留意body与options的混合bug
  // 需要在body里面声明 type = "body"||"options"，默认 "body"
  if (body?.type === "options") {
    const options1 = body as { [key: string]: any }
    return request<Type>(url, {
      method,
      ...(options1 || {}),
      ...(options || {}),
    });
  }

  const params = method === 'GET' ? body : null;
  return request<Type>(url, {
    method,
    data: body,
    params,
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
    return baseRequest<Type>('DELETE', url, body, options)
  },
  request: baseRequest,
}
