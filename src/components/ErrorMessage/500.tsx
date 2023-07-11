import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { HOME_URL } from '@/config';
import Center from '@/components/Center';

const NotNetwork = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate(HOME_URL);
  };
  return (
    <Center>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={
          <Button type="primary" onClick={goHome}>
            Back Home
          </Button>
        }
      />
    </Center>
  );
};

export default NotNetwork;
