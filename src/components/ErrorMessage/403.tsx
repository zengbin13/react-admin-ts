import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { HOME_URL } from '@/config';
import Center from '@/components/Center';

const NotAuth = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate(HOME_URL);
  };
  return (
    <Center>
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={goHome}>
            Back Home
          </Button>
        }
      />
    </Center>
  );
};

export default NotAuth;
