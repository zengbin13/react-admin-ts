import { RouteObject } from 'react-router-dom';

export interface MateProps {
  key?: string;
  title?: string;
  requiresAuth?: boolean;
  hidden?: boolean;
  icon?: React.ReactNode;
}

declare type RouteExtendObject = RouteObject & {
  meta?: MateProps;
};
