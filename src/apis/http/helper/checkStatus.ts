import { message } from 'antd';

const CODE_MESSAGE: any = {
  200: '服务器成功返回请求数据',
  201: '新建或修改数据成功',
  202: '一个请求已经进入后台排队(异步任务)',
  204: '删除数据成功',
  400: '发出信息有误',
  401: '用户无权限(令牌失效、用户名、密码错误、登录过期)',
  402: '令牌过期',
  403: '用户得到授权，但是访问是被禁止的',
  404: '访问资源不存在',
  406: '请求格式不可得',
  410: '请求资源被永久删除，且不会被看到',
  422: '未查询到数据，不可导出',
  500: '服务器发生错误',
  502: '网关错误',
  503: '服务不可用，服务器暂时过载或维护',
  504: '网关超时'
};
/**
 * @description: 正常业务逻辑code
 */
export const codeVerificationArray: Array<number | string> = [200, 0, '200', '0'];

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @param {String} statusText
 * @return void
 */
export function checkStatus(status: number, statusText?: string) {
  const errorMessage = statusText || CODE_MESSAGE[status] || '请求失败';
  message.error(errorMessage);
}
