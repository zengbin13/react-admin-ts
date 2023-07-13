import { useRoute } from '@/hooks/useRoute';
import { Navigate, useLocation, useOutlet, useRouteLoaderData } from 'react-router-dom';
import { UserInfo } from '@/interface/user';

/**
 * @description 路由权限守卫
 */
function AuthRouter() {
  const outlet = useOutlet();
  const { pathname } = useLocation();
  const userInfo = useRouteLoaderData('root') as UserInfo | undefined;
  const route = useRoute();
  console.log(`跳转路由:${pathname} - 匹配路由:`, route, ` - 用户信息:`, userInfo);
  const token = localStorage.getItem('token');

  // 当前路由无需权限放行
  if (!route?.meta?.auth) return outlet;
  // 需要权限 并且 token或用户信息不存在存在
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
