import { NonIndexRouteObject, IndexRouteObject } from 'react-router-dom';

export interface MetaProps {
  key?: string;
  title?: string;
  auth?: string;
  hidden?: boolean;
  icon?: React.ReactNode;
}
interface ExtendedNonIndexRouteObject extends NonIndexRouteObject {
  children?: ExtendedRouteObject[];
  meta?: MetaProps;
}
interface ExtendedIndexRouteObject extends IndexRouteObject {
  meta?: MetaProps;
}
declare type ExtendedRouteObject = ExtendedIndexRouteObject | ExtendedNonIndexRouteObject;
