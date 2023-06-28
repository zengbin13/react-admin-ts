import { Button, ConfigProvider, theme } from 'antd'

function App() {
  const { token } = theme.useToken()
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: token.colorPrimary,
        },
        algorithm: theme.defaultAlgorithm,
      }}
    >
      <Button type="primary">按钮样式</Button>
    </ConfigProvider>
  )
}

export default App
