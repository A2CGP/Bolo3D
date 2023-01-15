import { Row } from '../../../base/Flex';
import Editor, { EditorType } from '../../Editor';
import './index.less';

const Layout = () => {
  return (
    <Row className='nuwa-workspace-layout'>
      <div className='nuwa-workspace-layout--body'>
        <Editor type={EditorType.Viewport3D} />
      </div>
      <div className='nuwa-workspace-layout--right-sidebar'>
        <Editor type={EditorType.Outliner} />
        <Editor type={EditorType.Propperties} />
      </div>
    </Row>
  );
};

export default Layout;