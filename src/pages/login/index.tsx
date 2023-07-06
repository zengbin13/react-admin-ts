// @ts-ignore
import CartoonFigureCanvas from './components/CartoonFigureCanvas/index.jsx';
import logoImg from '@/assets/images/logo.png';
import LoginForm from './components/LoginForm';
import styles from './index.module.less';
import useTheme from '@/hooks/useTheme';
function Login() {
  const { colorPrimary } = useTheme();
  return (
    <div className={`${styles.root} p-4 sm:p-10 xl:p-24 `}>
      <div className="bg-[#ffffff30] backdrop-blur-md overflow-hidden flex-1 w-full flex flex-col rounded-xl  md:rounded-2xl  md:flex-row xl:max-w-[1200px]  xl:rounded-3xl">
        {/* 左侧介绍 */}
        <div className="flex-1 p-4 flex justify-center items-center" style={{ backgroundColor: colorPrimary }}>
          <CartoonFigureCanvas></CartoonFigureCanvas>
        </div>
        {/* 右侧表单 */}
        <div className="flex-1 flex justify-center">
          <div className="form-wrap flex flex-col mt-[10%] items-center p-4  max-w-[500px] min-w-[320px]">
            <img src={logoImg} alt="logo" className="w-20 h-20 rounded-full border mb-4" />
            <h2 className="text-3xl">XX后台管理</h2>
            <p className=" text-gray-400  py-4">投我以木桃，报之以琼瑶。匪报也，永以为好也。</p>
            <LoginForm></LoginForm>
            <div className="text-gray-400 ">
              Don&apos;t have an account yet? <a href="#">Sign Up</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
