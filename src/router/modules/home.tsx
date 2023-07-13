import { lazy } from 'react';
import LazyLoad from '@/router/utils/LazyLoad';
import { ExtendedRouteObject } from '#/router';
const Home = lazy(() => import('@/pages/home/index'));
const Home2 = lazy(() => import('@/pages/home/index2'));
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
          title: '首页-1',
          auth: 'admin'
        }
      },
      {
        path: 'index2',
        element: LazyLoad(Home2),
        meta: {
          title: '首页-2',
          auth: 'admin2'
        }
      }
    ]
  }
];

export default errorRoutes;
