// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { User, BaseUser } from './data';

/** 获取用户列表 GET /user/userList */
export async function user(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
    keyword?: string;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: User[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/user/userList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取用户 GET /user */
export async function getUser(uid: number, options?: { [key: string]: any }) {
  return request<User>('/user', {
    data: { id: uid },
    method: 'GET',
    ...(options || {}),
  });
}

/** 更新用户 PUT /user */
export async function updateUser(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<User>('/user', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建用户 POST /user */
export async function addUser(data: BaseUser, options?: { [key: string]: any }) {
  return request<User>('/user', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除用户 DELETE /user */
export async function removeUser(data: { uid: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/user', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
