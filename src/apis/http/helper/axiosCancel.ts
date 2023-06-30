import axios, { AxiosRequestConfig, Canceler } from 'axios';

// 序列化参数
const getPendingUrl = (config: AxiosRequestConfig): string => {
  return [config.method, config.url, JSON.stringify(config.data), JSON.stringify(config.params)].join('&');
};

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
let pendingMap = new Map<string, Canceler>();

export class AxiosCanceler {
  /**
   * @description: 添加请求
   */
  addPending(config: AxiosRequestConfig) {
    // 请求前移除相同请求
    this.removePending(config);
    // 获取请求唯一key值
    const url = getPendingUrl(config);
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          // 如果 pending 中不存在当前请求，则添加进去
          pendingMap.set(url, cancel);
        }
      });
  }
  /**
   * @description: 移除请求
   */
  removePending(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);
    if (pendingMap.has(url)) {
      // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
      const cancel = pendingMap.get(url);
      cancel && cancel();
      pendingMap.delete(url);
    }
  }

  /**
   * @description: 清空所有pending
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      cancel && cancel();
    });
    pendingMap.clear();
  }

  /**
   * @description: 重置
   */
  reset() {
    pendingMap = new Map<string, Canceler>();
  }
}
