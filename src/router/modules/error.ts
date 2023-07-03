import { lazy } from 'react';
import LazyLoad from '@/router/utils/LazyLoad';
import { RouteExtendObject } from '#/router';
const Forbidden = lazy(() => import('@/components/ErrorMessage/403'));
const NotFound = lazy(() => import('@/components/ErrorMessage/404'));
const ServerError = lazy(() => import('@/components/ErrorMessage/500'));

const errorRoutes: RouteExtendObject[] = [
  {
    path: '/403',
    element: LazyLoad(Forbidden),
    meta: {
      key: '403',
      title: '403',
      hidden: true
    }
  },
  {
    path: '/404',
    element: LazyLoad(NotFound),
    meta: {
      key: '404',
      title: '404',
      hidden: true
    }
  },
  {
    path: '/500',
    element: LazyLoad(ServerError),
    meta: {
      key: '500',
      title: '500',
      hidden: true
    }
  }
];

export default errorRoutes;
