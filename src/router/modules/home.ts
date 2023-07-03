import { lazy } from 'react';
import LazyLoad from '@/router/utils/LazyLoad';
import { RouteExtendObject } from '#/router';
const Home = lazy(() => import('@/pages/home/index'));

const errorRoutes: RouteExtendObject[] = [
  {
    path: '/',
    element: LazyLoad(Home),
    meta: {
      title: '首页'
    }
  }
];

export default errorRoutes;
