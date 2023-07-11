import { useRoute } from '@/hooks/useRoute';
import { Navigate, useLocation, useOutlet, useRouteLoaderData } from 'react-router-dom';
import { UserInfo } from '@/interface/user';
import { HOME_URL } from '@/config';

/**
 * @description 路由权限守卫
 */
function AuthRouter() {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const userInfo = useRouteLoaderData('root') as UserInfo | undefined;
  const route = useRoute();
  console.log(`跳转路由:${pathname} - 匹配路由:`, route, ` - 用户信息:`, userInfo);
  // 校验前往登录页是否已经登录
  if (pathname == '/login' && userInfo) <Navigate to={HOME_URL} />;
  // 当前路由无需权限放行
  if (!route?.meta?.auth) return outlet;
  // 判断token/用户信息是否存在
  const token = localStorage.getItem('token');
  if (!token || !userInfo) return <Navigate to="/login" />;
  // token/用户信息存在
  const auth = route.meta.auth;
  const authList = userInfo.auth;
  // 具有权限正常访问
  if (authList.includes(auth)) return outlet;
  // 无权限重定向403
  else return <Navigate to="/403" />;
}

export default AuthRouter;
