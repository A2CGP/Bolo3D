import logo from '@/assets/react.svg';
import './index.less';

const TopBar = () => {
  return (
    <div className='nuwa-topbar'>
      <img className='nuwa-logo' src={logo} alt='' />
    </div>
  );
};

export default TopBar;