import { Suspense } from 'react';

function LazyLoad(Component: React.LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<div>loading</div>}>
      <Component />
    </Suspense>
  );
}

export default LazyLoad;
