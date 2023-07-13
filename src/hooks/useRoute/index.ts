import { useLocation, matchRoutes, useNavigate } from 'react-router-dom';
import { routes } from '@/router/index';

/**
 * @description 获取当前路由
 */
export function useRoute() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const match = matchRoutes(routes, pathname);
  if (!match) {
    navigate('/404');
    return;
  }
  return match[match.length - 1].route;
}
