import { theme } from 'antd';

const { useToken } = theme;

function useTheme() {
  const { token } = useToken();
  console.log(token);
  return {
    token,
    colorPrimary: token.colorPrimary
  };
}

export default useTheme;
