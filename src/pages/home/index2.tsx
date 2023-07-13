import { Button } from 'antd';
import { Link } from 'react-router-dom';

function Home2() {
  return (
    <div>
      <Button type="primary">
        <Link to="/index">跳转1</Link>
      </Button>
    </div>
  );
}

export default Home2;
