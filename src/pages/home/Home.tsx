import { Button } from 'antd';
import http from '@/apis/http/index';

function Home() {
  const handleClick = () => {
    http.get('/test', {
      params: {
        a: 'xx'
      }
    });
  };
  return (
    <div>
      <Button type="primary" onClick={handleClick}>
        按钮样式
      </Button>
    </div>
  );
}

export default Home;
