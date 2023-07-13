import apis from '@/apis';
import FullLoading from '@/components/FullLoading';
import { UserInfo } from '@/interface/user';
import { Suspense } from 'react';
import { Await, useLoaderData, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useRoute } from '@/hooks/useRoute';
import { HOME_URL } from '@/config';

export const goHomePage = () => (window.location.href = HOME_URL);

export const getUserInfo = async () => {
  try {
    const { data } = await apis.user.getUserInfoApi();
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
};

function AuthLayout() {
  const route = useRoute();
  const { pathname } = useLocation();

  console.log(`跳转路由:${pathname} - 匹配路由:`, route);

  // 获取延迟的用户信息
  const { userPromise } = useLoaderData() as {
    userPromise: () => Promise<UserInfo>;
  };

  // 当前路由是否需要权限
  const auth = route?.meta?.auth;

  /**
   * errorElement: 作为获取用户信息失败的显示
   * 当前路由需权限: 显示登录页
   * 当前路由无需权限: 放行显示自身
   */
  let errorElement = <Navigate to="/login" />;
  if (!auth) errorElement = <Outlet />;

  return (
    <Suspense fallback={<FullLoading />}>
      {/* errorElement 获取用户信息失败显示登录页面 */}
      <Await resolve={userPromise} errorElement={errorElement}>
        {(user: UserInfo) => {
          // 具备用户信息在登陆页面跳转首页
          if (user && pathname == '/login') return <Navigate to={HOME_URL} />;
          // 用户具备的权限
          const authList = user.auth;
          if (!auth || authList.includes(auth)) return <Outlet />;
          return <Navigate to="/403" replace />;
        }}
      </Await>
    </Suspense>
  );
}

export default AuthLayout;
