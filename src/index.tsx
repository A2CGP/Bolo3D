import ReactDOM from 'react-dom/client';
import { Column } from '@/base-components/Flex';
import TopBar from '@/components/TopBar';
import Workspace from '@/components/Workspace';
import StatusBar from '@/components/StatusBar';
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
  .render(<App />);