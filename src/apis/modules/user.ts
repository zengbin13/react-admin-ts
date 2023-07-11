import http from '@/apis/http/index';

/**
 * @description: 登录接口
 */
function loginApi(data: { username: string; password: string }) {
  return http.post<{ token: string }>('/api/login', data, {
    headers: {
      fullLoading: false
    }
  });
}

/**
 * @description: 获取用户数据接口
 */
function getUserInfoApi() {
  return http.get<{ username: string; auth: string[] }>('/api/fetchUser');
}

export default {
  loginApi,
  getUserInfoApi
};
