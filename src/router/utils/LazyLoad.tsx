import { Suspense } from 'react';
import { Spin } from 'antd';

/**
 * @description 路由懒加载
 * @param {Element} Component 需要加载的组件
 * @returns element
 */
function LazyLoad(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<Spin size="large" className="h-full flex-1 flex justify-center items-center" />}>
      <Component />
    </Suspense>
  );
}

export default LazyLoad;
