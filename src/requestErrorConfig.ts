import type { RequestConfig, } from '@umijs/max';
// import { message, notification } from 'antd';
import { RequestOptions } from './.umi/plugin-request/request';
import RequestErrorHandler, { ResponseErrorStruct } from './requestErrorHandler';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
  TraceMessage?: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType, traceMessage } =
        res as unknown as ResponseErrorStruct;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { success, errorCode, errorMessage, showType, data, traceMessage };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      // if (opts?.skipErrorHandler) throw error;
      RequestErrorHandler(error, opts);
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (options: RequestOptions) => {
      // if (options) throw error;
      const token = localStorage.getItem('jwtToken');
      if (!token) return options;
      try {
        const jwt: API.JwtToken = JSON.parse(token);
        if (jwt.access_expire < Date.now() / 1000) {
          throw new Error("token is expired");
        }
        if (!options.headers) {
          options.headers = {};
        }
        options.headers['Authorization'] = jwt.access_token;
      } catch (error) {
        localStorage.removeItem('jwtToken');
      }
      return options;
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;
      if (!data.success) {
        // if (data.traceMessage.trim().length){
        //   message.error(data.traceMessage);
        // }
        // message.error('请求失败！');
        // message.error(data.errorMessage);
      }
      return response;
    },
  ],
};
