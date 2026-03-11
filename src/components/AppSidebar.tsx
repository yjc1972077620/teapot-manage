import React from 'react';
import { Layout } from 'antd';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faServer, faSync, faDatabase as faMysql, faFileAlt, faTools } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

type SidebarProps = {
  sidebarOpen: boolean;
};

type MenuItem = {
  path: string;
  icon: IconDefinition;
  label: string;
};

const AppSidebar = ({ sidebarOpen }: SidebarProps) => {
  const menuConfig: MenuItem[] = [
    { path: '/home', icon: faServer, label: '首页' },
    { path: '/es-sync', icon: faSync, label: 'ES同步管理' },
    { path: '/local-deploy', icon: faServer, label: '本地部署' },
    { path: '/clickhouse-sync', icon: faDatabase, label: 'Clickhouse同步' },
    { path: '/doris-sync', icon: faDatabase, label: 'Doris同步' },
    { path: '/mysql-source', icon: faMysql, label: 'MySQL数据源管理' },
    { path: '/log/list', icon: faFileAlt, label: '日志管理' },
    // 其他功能入口
    { path: '/other-functions', icon: faTools, label: '其他功能' },
  ];

  const getNavLinkClass = (isActive: boolean) =>
    isActive
      ? 'flex items-center px-4 py-3 text-blue-600 bg-blue-50 border-r-4 border-blue-600 transition-colors duration-300 ease-in-out'
      : 'flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors duration-300 ease-in-out';

  return (
    <Layout.Sider
      collapsed={!sidebarOpen}
      collapsedWidth={80}
      width={256}
      trigger={null}
      className="!fixed !left-0 !top-0 !h-full !z-30 !bg-white !shadow-md"
    >
      <div className="p-4 border-b border-gray-200 relative h-16 flex items-center">
        <div className={`flex items-center space-x-2 transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 delay-75'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <FontAwesomeIcon icon={faServer} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-blue-600 whitespace-nowrap">Teapot Manager</h1>
        </div>

        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}>
          <FontAwesomeIcon icon={faServer} className="text-white" />
        </div>
      </div>

      <nav className="py-6 pb-12">
        <ul>
          {menuConfig.map((menu, index) => (
            <li key={index} className="mb-1">
              <NavLink
                to={menu.path}
                className={({ isActive }) => getNavLinkClass(isActive)}
                onClick={(event) => {
                  const isMobile = window.innerWidth < 1024;
                  if (isMobile && menu.path !== event.currentTarget.pathname) {
                    // 移动端收起逻辑由上层控制
                  }
                }}
              >
                <FontAwesomeIcon icon={menu.icon} className={`w-5 text-center transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-0' : 'ml-1'}`} />
                <span className={`ml-3 whitespace-nowrap transition-all duration-300 ease-in-out ${sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 delay-75'}`}>
                  {menu.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </Layout.Sider>
  );
};

export default AppSidebar;
