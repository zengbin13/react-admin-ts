import http from '@/apis/http/index';

/**
 * @description: 登录接口
 */
function loginApi(data: { username: string; password: string }) {
  return http.post<{ token: string }>('/api/login', data, {
    headers: {
      fullLoading: true
    }
  });
}

export default {
  loginApi
};
