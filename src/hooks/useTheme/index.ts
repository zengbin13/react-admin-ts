import { theme } from 'antd';

const { useToken } = theme;

function useTheme() {
  const { token } = useToken();
  return {
    token,
    colorPrimary: token.colorPrimary
  };
}

export default useTheme;
