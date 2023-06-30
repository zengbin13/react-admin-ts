import { ConfigProvider, theme } from 'antd';

import Home from '@/pages/home/Home';

function App() {
  const { token } = theme.useToken();
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: token.colorPrimary
        },
        algorithm: theme.defaultAlgorithm
      }}
    >
      <Home />
    </ConfigProvider>
  );
}

export default App;
