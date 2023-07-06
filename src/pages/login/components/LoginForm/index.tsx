import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input } from 'antd';
import styles from './index.module.less';
import useTheme from '@/hooks/useTheme';
import apis from '@/apis';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { token } = useTheme();
  const onFinish = async (values: { username: string; password: string }) => {
    try {
      setLoading(true);
      const { data } = await apis.user.loginApi(values);
      console.log(data.token);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <Form name="login" className="login-form " initialValues={{ remember: true }} onFinish={onFinish} size="large">
        {/* 用户名邮箱 */}
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名称' }]}>
          <Input className="h-[42px]" style={{ backgroundColor: token.colorInfoBg }} prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        {/* 密码 */}
        <Form.Item name="password" rules={[{ required: true, message: '请输入你的密码' }]}>
          <Input
            style={{ backgroundColor: token.colorInfoBg }}
            className="h-[42px]"
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        {/* 其他 */}
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
          <a href="" className="float-right">
            忘记密码
          </a>
        </Form.Item>
        {/* 登录按钮 */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            {loading ? <LoadingOutlined style={{ fontSize: 24 }} spin /> : '登 录'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginForm;
