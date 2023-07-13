import { lazy } from 'react';
import LazyLoad from '@/router/utils/LazyLoad';
import { ExtendedRouteObject } from '#/router';
const Home = lazy(() => import('@/pages/home/index'));
import Layout from '@/layouts/index';
const errorRoutes: ExtendedRouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    meta: {
      title: '首页'
    },
    children: [
      {
        path: 'index',
        element: LazyLoad(Home),
        meta: {
          title: '首页-2',
          auth: 'admin'
        }
      }
    ]
  }
];

export default errorRoutes;
