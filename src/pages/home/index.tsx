import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/index2');
  };
  return (
    <div>
      <Button type="primary" onClick={() => handleClick()}>
        跳转2
      </Button>
    </div>
  );
}

export default Home;
