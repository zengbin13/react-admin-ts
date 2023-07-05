import { DataRouteObject } from 'react-router-dom';

export interface MateProps {
  key?: string;
  title?: string;
  requiresAuth?: boolean;
  hidden?: boolean;
  icon?: React.ReactNode;
}

export interface ExtendedDataRouteObject extends DataRouteObject {
  mate?: MateProps;
  children?: ExtendedDataRouteObject[];
}

declare type ExtendedRouteObject = IndexRouteObject | NonIndexRouteObject | ExtendedDataRouteObject;
