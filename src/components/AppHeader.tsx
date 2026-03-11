import type { ReactNode } from 'react';
import { Layout } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

type HeaderProps = {
  onToggleSidebar?: () => void;
  children?: ReactNode;
  userInfo?: ReactNode;
};

const AppHeader = ({ onToggleSidebar, children, userInfo }: HeaderProps) => {
  return (
    <Layout.Header className="bg-white shadow-sm sticky top-0 z-20 !px-0 !h-auto">
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center space-x-6">
          <button
            onClick={onToggleSidebar}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="切换侧边栏"
            title="切换侧边栏"
          >
            <FontAwesomeIcon icon={faBars} className="w-6 h-6" />
          </button>
          <div className="hidden sm:block">
            {children}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {userInfo}
        </div>
      </div>
    </Layout.Header>
  );
};

export default AppHeader;
