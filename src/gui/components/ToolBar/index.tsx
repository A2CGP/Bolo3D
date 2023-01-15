import './index.less';

const ToolBar = () => {
  return (
    <div className='nuwa-toolbar'>
      <div className='nuwa-toolbar-group'>
        <div className='iconfont icon-toolbar-select'></div>
        <div className='iconfont icon-toolbar-cursor'></div>
      </div>
      <div className='nuwa-toolbar-group'>
        <div className='iconfont icon-toolbar-move'></div>
        <div className='iconfont icon-toolbar-rotate'></div>
        <div className='iconfont icon-toolbar-scale'></div>
      </div>
    </div>
  );
};

export default ToolBar;