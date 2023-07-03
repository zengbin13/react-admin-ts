import { Button } from 'antd';
import apis from '@/apis';

function Home() {
  const handleClick = async () => {
    const res = await apis.loginApi({
      username: 'xx',
      password: 'xx'
    });
    console.log(res);
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
