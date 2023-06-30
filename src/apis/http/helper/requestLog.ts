import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export function reqeuestLog(config: AxiosRequestConfig) {
  if (import.meta.env.MODE !== 'development') return;
  console.log(`🦄 请求方法：${config.method} - 请求地址：${config.url} - 请求参数：${JSON.stringify(config.params || config.data)}`);
}

export function responseLog(response: AxiosResponse) {
  if (import.meta.env.MODE !== 'development') return;
  console.log(`🐣 请求地址：${response.config.url} -请求结果:`, response.data.data);
}
