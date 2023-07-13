import { createBrowserRouter, Navigate, RouterProvider, defer } from 'react-router-dom';
import { lazy } from 'react';
import type { ExtendedRouteObject } from '#/router';

import LazyLoad from './utils/LazyLoad';
import AuthLayout, { getUserInfo } from './utils/AuthLayout';

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

export const routes: ExtendedRouteObject[] = [
  {
    id: 'root',
    loader: () => defer({ userPromise: getUserInfo() }),
    element: <AuthLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/login" />
      },
      {
        path: '/login',
        element: LazyLoad(Login)
      },
      ...routesList
    ]
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
