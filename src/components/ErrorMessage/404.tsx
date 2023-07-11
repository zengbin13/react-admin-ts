import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { HOME_URL } from '@/config';
import Center from '@/components/Center';

const NotFound = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate(HOME_URL);
  };
  return (
    <Center>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" onClick={goHome}>
            Back Home
          </Button>
        }
      />
    </Center>
  );
};

export default NotFound;
