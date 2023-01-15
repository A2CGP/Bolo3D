import { Column } from './base/Flex';
import TopBar from './components/TopBar';
import Workspace from './components/Workspace';
import StatusBar from './components/StatusBar';
import './index.less';

const App = () => {
  return (
    <Column>
      <TopBar />
      <Workspace />
      <StatusBar />
    </Column>
  );
};

export default App;