import axios from 'axios';
import type { AxiosInstance, CreateAxiosDefaults, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { reqeuestLog, responseLog, checkStatus, codeVerificationArray, AxiosCanceler, showFullScreenLoading, tryHideFullScreenLoading } from './helper';
import { message } from 'antd';

import FullLoading from '@/components/FullLoading';
const axiosCanceler = new AxiosCanceler();
import type { ResultData, AxiosCustomRequestConfig } from './types';

/****** 进度条配置 *******/
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条的速度
  showSpinner: false, // 是否显示加载ico
  trickleSpeed: 200, // 自动递增间隔
  minimum: 0.3 // 初始化时的最小百分比
});
/****** 进度条配置 *******/

class HttpRequst {
  service: AxiosInstance;
  constructor(config: CreateAxiosDefaults) {
    // 实例化axios
    this.service = axios.create(config);
    /**
     * @description: 请求拦截器
     * 客户端发送请求 -> [请求拦截器] -> 服务器
     * token校验(JWT) : 接受服务器返回的token,存储到redux/本地储存当中
     */
    this.service.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 1.开启进度条
        NProgress.start();
        // 2.将当前请求添加到 pendingMap 中
        axiosCanceler.addPending(config);
        // 3.是否展示全屏loading
        console.log(config.headers, 'xx');
        config.headers.fullLoading && showFullScreenLoading(<FullLoading />);
        // 4.添加token
        const token = localStorage.getItem('token');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;
        reqeuestLog(config);
        return config;
      },
      (error) => {
        NProgress.done();
        return Promise.reject(error);
      }
    );
    /**
     * @description: 响应拦截器
     * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
     */
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { config } = response;
        // 1.关闭进度条
        NProgress.done();
        // 2.请求结束移除本次请求
        axiosCanceler.removePending(config);
        // 3.关闭全屏loading
        tryHideFullScreenLoading();
        // 4.处理响应
        return this.handleResponseData(response);
      },
      (error) => {
        NProgress.done();
        tryHideFullScreenLoading();
        const { response } = error;
        // 处理无返回错误
        if (!response) {
          //浏览器网络断开 - 跳转断网页面
          if (!window.navigator.onLine) window.location.hash = '/500';
          if (error.message.includes('timeout')) message.error('请求超时');
          else message.error('连接后台接口失败');
          return Promise.reject(error);
        }
        // 处理返回数据
        if (response) return this.handleResponseData(response);
      }
    );
  }
  /**
   * @description: 处理后台响应数据
   */
  handleResponseData(response: AxiosResponse) {
    const { data, status } = response;
    // 1.输出结果日志
    responseLog(response);

    // 2.使用返回数据覆盖code值
    let code: number = data?.code || status;
    if (codeVerificationArray.includes(code)) code = 200;

    // 3.处理业务逻辑
    switch (code) {
      case 200:
        // 正常业务逻辑
        return data;
      case 401:
        // 登录过期
        break;
      case 403:
        // 无权限
        break;
      default:
        break;
    }
    // 4.处理异常数据
    checkStatus(code, data?.message);
    return Promise.reject(data);
  }
  get<T>(url: string, config?: AxiosCustomRequestConfig): Promise<ResultData<T>> {
    return this.service.get(url, config);
  }
  post<T, D = any>(url: string, data: D, config?: AxiosCustomRequestConfig<D>): Promise<ResultData<T>> {
    return this.service.post(url, data, config);
  }
  put<T, D = any>(url: string, data: D, config?: AxiosCustomRequestConfig<D>): Promise<ResultData<T>> {
    return this.service.put(url, data, config);
  }
  delete<T, D = any>(url: string, config?: AxiosCustomRequestConfig<D>): Promise<ResultData<T>> {
    return this.service.delete(url, config);
  }
}

const config: AxiosCustomRequestConfig = {
  // 默认地址请求地址，可在 .env 开头文件中修改
  // baseURL: import.meta.env.VITE_API_URL,
  // 使用http-proxy处理跨域
  baseURL: '',
  // 设置超时时间（10s）
  timeout: 10000,
  // 跨域时候允许携带凭证
  withCredentials: true,
  headers: {
    fullLoading: false
  }
};

export default new HttpRequst(config);
