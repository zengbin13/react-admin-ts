import { Spin } from 'antd';
import styles from './index.module.less';

function FullLoading() {
  return (
    <div className={styles.root}>
      <Spin size="large"></Spin>
    </div>
  );
}

export default FullLoading;
