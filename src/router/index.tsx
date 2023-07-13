import { createBrowserRouter, Navigate, RouterProvider, LoaderFunctionArgs } from 'react-router-dom';
import { lazy } from 'react';
import type { ExtendedRouteObject } from '#/router';
import apis from '@/apis';
import LazyLoad from './utils/LazyLoad';
import AuthRouter from './utils/AuthRouter';
import ErrorBoundary from './utils/ErrorBoundary';

// 导入路由模块 - 有序
import homeRoutes from './modules/home';
import errorRoutes from './modules/error';
const routesList: ExtendedRouteObject[] = [...homeRoutes, ...errorRoutes];

// 导入路由模块 - 无序
// const routesList: ExtendedRouteObject[] = [];
// const modules = import.meta.glob('./modules/*.{tsx,ts}', { eager: true });
// Object.values(modules).forEach((item) => {
//   routesList.push(...(item as { default: Array<ExtendedRouteObject> }).default);
// });

const Login = lazy(() => import('@/pages/login'));
const rootLoader = async ({ request, params }: LoaderFunctionArgs) => {
  try {
    const { data } = await apis.user.getUserInfoApi();
    return data;
  } catch (error) {
    console.error(error, request, params);
    return null;
  }
};

export const routes: ExtendedRouteObject[] = [
  {
    id: 'root',
    // https://reactrouter.com/en/main/route/loader
    loader: rootLoader,
    element: <AuthRouter />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" />
      },
      // 请求后端用户权限路由
      ...routesList
    ]
  },
  // 避免登录跳转首页不加载loader数据 AuthRouter鉴权无法通过
  {
    path: '/login',
    element: LazyLoad(Login)
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  }
];

export const router = createBrowserRouter(routes);

// 箭头函数修复:JSX 元素类型不具有任何构造签名或调用签名
const Router = () => <RouterProvider router={router}></RouterProvider>;

export default Router;
