import type { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess } from './_util';

export default [
  {
    url: '/api/login',
    method: 'post',
    timeout: 1000,
    response: ({ body }: { body: Record<string, string> }) => {
      const { username, password } = body;
      if (!username || username.length < 6) return resultError('账号格式不正常');
      if (!password || password.length < 6) return resultError('密码不正常');
      return resultSuccess({
        token: 'HVeUSCHLl6mA__ohs1NvAEUOzGUuyrXEZxufw_S__WY'
      });
    }
  },
  {
    url: '/api/fetchUser',
    method: 'get',
    timeout: 1000,
    response: ({ headers }: { headers: Record<string, string> }) => {
      if (!headers.authorization) {
        return resultError('登录过期', { code: 401 });
      }
      return resultSuccess({
        username: '可爱多',
        auth: ['admin']
      });
    }
  }
] as MockMethod[];
