import { ConfigProvider, theme } from 'antd';
import Router from '@/router/index';

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
      <Router />
    </ConfigProvider>
  );
}

export default App;
