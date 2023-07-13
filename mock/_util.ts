function resultSuccess<T = Record<string, any>>(data: T, { message = 'ok' } = {}) {
  return {
    code: 0,
    data,
    message,
    type: 'success'
  };
}

function resultError(message = 'Request failed', { code = -1, data = null } = {}) {
  return {
    code,
    data,
    message,
    type: 'error'
  };
}

/**
 * @description 本函数用于从request数据中获取token，请根据项目的实际情况修改
 *
 */
function getRequestToken({ headers }): string | undefined {
  return headers?.authorization;
}

export { resultError, resultSuccess, getRequestToken };
