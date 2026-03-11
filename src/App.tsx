import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate, Link } from 'react-router-dom';
import { Breadcrumb as AntBreadcrumb } from 'antd';
import AppSidebar from './components/AppSidebar';
import AppHeader from './components/AppHeader';
import loginAPI from './utils/auth';
import SyncInstanceDetail from './modules/instance/SyncInstanceDetail';
import SyncInstanceCreate from './modules/instance/SyncInstanceCreate';
import SyncInstanceList from './modules/instance/SyncInstanceList';
import MySQLSourceList from './modules/datasource/MySQLSourceList';
import Home from './modules/home/Home';
import LogList from './modules/log/LogList';
import LogDetail from './modules/log/LogDetail';
import RealTimeLog from './modules/log/RealTimeLog';
import LoginPage from './modules/auth/loginPage';
import OtherFunctions from './modules/other/OtherFunctions';
import './App.css';

// 面包屑组件
const Breadcrumb = () => {
  const location = useLocation();
  const path = location.pathname;
  const state = location.state as { syncType?: number } | undefined;
  const querySyncType = new URLSearchParams(location.search).get('syncType');
  const routeSyncType = state?.syncType != null ? Number(state.syncType) : (querySyncType ? Number(querySyncType) : undefined);

  const routeMap = {
    'home': '首页',
    'es-sync': 'ES同步管理',
    'local-deploy': '本地部署',
    'clickhouse-sync': 'Clickhouse同步',
    'doris-sync': 'Doris同步',
    'mysql-source': 'MySQL数据源管理',
    'log/list': '日志列表',
    'log/detail': '日志详情',
    'log/realtime': '实时日志',
    'instance/detail': '实例详情',
    'instance/create': '新增实例',
    'instance/edit': '编辑实例',
    'other-functions': '其他功能'
  };

  const getInstanceListPath = () => {
    if (routeSyncType === 1) return '/local-deploy';
    if (routeSyncType === 3) return '/clickhouse-sync';
    if (routeSyncType === 6) return '/doris-sync';
    return '/es-sync';
  };

  const getInstanceListLabel = () => {
    if (routeSyncType === 1) return routeMap['local-deploy'];
    if (routeSyncType === 3) return routeMap['clickhouse-sync'];
    if (routeSyncType === 6) return routeMap['doris-sync'];
    return routeMap['es-sync'];
  };

  const items: { title: React.ReactNode }[] = [
    { title: <Link className="text-gray-500" to="/home">首页</Link> }
  ];

  const pushLink = (label: string, to?: string, isLast = false) => {
    if (to && !isLast) {
      items.push({ title: <Link className="text-blue-600" to={to}>{label}</Link> });
      return;
    }
    items.push({ title: <span className="text-gray-500">{label}</span> });
  };

  if (/^\/home/.test(path)) {
    pushLink('首页', undefined, true);
  } else if (/^\/log\/detail\/\d+/.test(path)) {
    pushLink(routeMap['log/list'], '/log/list');
    pushLink(routeMap['log/detail'], undefined, true);
  } else if (/^\/log\/realtime\/\d+/.test(path)) {
    pushLink(routeMap['log/list'], '/log/list');
    pushLink(routeMap['log/realtime'], undefined, true);
  } else if (/^\/log\/list/.test(path)) {
    pushLink(routeMap['log/list'], undefined, true);
  } else if (/^\/instance\/detail\/\d+/.test(path)) {
    pushLink(getInstanceListLabel(), getInstanceListPath());
    pushLink(routeMap['instance/detail'], undefined, true);
  } else if (/^\/instance\/edit\/\d+/.test(path)) {
    pushLink(getInstanceListLabel(), getInstanceListPath());
    pushLink(routeMap['instance/edit'], undefined, true);
  } else if (/^\/instance\/create/.test(path)) {
    pushLink(getInstanceListLabel(), getInstanceListPath());
    pushLink(routeMap['instance/create'], undefined, true);
  } else if (/^\/mysql-source/.test(path)) {
    pushLink(routeMap['mysql-source'], undefined, true);
  } else if (/^\/local-deploy/.test(path)) {
    pushLink(routeMap['local-deploy'], undefined, true);
  } else if (/^\/clickhouse-sync/.test(path)) {
    pushLink(routeMap['clickhouse-sync'], undefined, true);
  } else if (/^\/doris-sync/.test(path)) {
    pushLink(routeMap['doris-sync'], undefined, true);
  } else if (/^\/es-sync/.test(path)) {
    pushLink(routeMap['es-sync'], undefined, true);
  } else {
    const pathParts = path.split('/').filter(Boolean).filter(part => !/^\d+$/.test(part));
    const validPaths = new Set([
      '/home',
      '/es-sync',
      '/local-deploy',
      '/clickhouse-sync',
      '/doris-sync',
      '/mysql-source',
      '/log/list',
      '/other-functions'
    ]);
    pathParts.forEach((part, index) => {
      const joined = pathParts.slice(0, index + 1).join('/');
      const key = joined in routeMap ? joined : part;
      const label = routeMap[key] || (part === 'home' ? '首页' : part);
      const to = `/${joined}`;
      pushLink(label, validPaths.has(to) ? to : undefined, index === pathParts.length - 1);
    });
  }

  return (
    <AntBreadcrumb
      className="text-sm text-gray-500"
      items={items}
    />
  );
};

// 用户信息组件
const UserInfo = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = () => {
      setIsLoading(true);
      try {
        const user = loginAPI.getCurrentUser();
        // 检查token是否过期
        if (user && user.isExpired && user.isExpired()) {
          console.warn('Token已过期');
          loginAPI.logout();
          navigate('/login', { replace: true });
          return;
        }
        setUserInfo(user);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        setUserInfo(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserInfo();
    
    // 定期检查用户信息更新
    const interval = setInterval(fetchUserInfo, 600000); // 每10分钟检查一次
    return () => clearInterval(interval);
  }, [navigate]);
  
  // 处理退出登录
  const handleLogout = () => {
    // 调用退出登录API
    loginAPI.logout();
    
    // 跳转到登录页面
    navigate('/login', { replace: true });
  };
  
  // 默认用户信息（当无法获取真实用户信息时使用）
  const defaultUser = {
    username: '管理员',
    email: 'admin@example.com',
    avatar: 'https://picsum.photos/id/1005/40/40'
  };
  
  // 使用真实用户信息或默认信息
  const displayUser = userInfo || defaultUser;
  
  // 从UserInfo实例中获取显示名称（如果是实例的话）
  let username = defaultUser.username;
  let email = defaultUser.email;
  let avatar = defaultUser.avatar;
  
  if (displayUser) {
    // 优先使用UserInfo实例的getDisplayName方法
    if (typeof displayUser.getDisplayName === 'function') {
      username = displayUser.getDisplayName();
    } else {
      // 兼容不同格式的用户信息
      username = displayUser.username;
    }
    
    email = displayUser.email || displayUser.userEmail || defaultUser.email;
    avatar = displayUser.avatar || defaultUser.avatar;
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="ml-2 hidden md:block">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-3 bg-gray-200 rounded mt-1 animate-pulse"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center">
      <img 
        src={avatar}
        alt="用户头像" 
        className="w-8 h-8 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-110"
      />
      <div className="ml-2 hidden md:block">
        <p className="text-sm font-medium text-gray-800">{username}</p>
        <p className="text-xs text-gray-500">{email}</p>
        {displayUser.group && (
          <p className="text-xs text-gray-400">{displayUser.group}</p>
        )}
      </div>
      {/* 退出按钮 */}
      <button
        onClick={handleLogout}
        className="ml-3 px-3 py-1 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
        title="退出登录"
      >
        退出
      </button>
    </div>
  );
};

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  // 检查是否有token
  const token = localStorage.getItem('token');
  
  // 如果没有token，重定向到登录页面
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // 切换侧边栏显示状态
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  
  return (
    <Router basename='/teapot'>
      <div className="flex h-screen bg-gray-50 w-full overflow-x-hidden">
        <Routes>
          {/* 登录路由 - 不需要侧边栏和头部 */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* 其他受保护的路由 */}
          <Route path="*" element={
            <>
              <AppSidebar sidebarOpen={sidebarOpen} />
              <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} overflow-x-hidden`}>
                <AppHeader 
                  onToggleSidebar={toggleSidebar}
                  userInfo={<UserInfo />}
                >
                  <Breadcrumb />
                </AppHeader>
                <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden w-full">
                  <div className="w-full overflow-x-hidden">
                    <Routes>
                      <Route path="/es-sync" element={<ProtectedRoute><SyncInstanceList syncType={2} /></ProtectedRoute>} />
                      <Route path="/instance/detail/:id" element={<ProtectedRoute><SyncInstanceDetail /></ProtectedRoute>} />
                      <Route path="/instance/create/" element={<ProtectedRoute><SyncInstanceCreate /></ProtectedRoute>} />
                      <Route path="/instance/edit/:id" element={<ProtectedRoute><SyncInstanceCreate /></ProtectedRoute>} />
                      <Route path="/local-deploy" element={<ProtectedRoute><SyncInstanceList syncType={1} /></ProtectedRoute>} />
                      <Route path="/clickhouse-sync" element={<ProtectedRoute><SyncInstanceList syncType={3} /></ProtectedRoute>} />
                      <Route path="/doris-sync" element={<ProtectedRoute><SyncInstanceList syncType={6} /></ProtectedRoute>} />
                      <Route path="/mysql-source" element={<ProtectedRoute><MySQLSourceList /></ProtectedRoute>} />
                      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                      <Route path="/log/list" element={<ProtectedRoute><LogList /></ProtectedRoute>} />
                      <Route path="/log/detail/:id" element={<ProtectedRoute><LogDetail /></ProtectedRoute>} />
                      <Route path="/log/realtime/:id" element={<ProtectedRoute><RealTimeLog /></ProtectedRoute>} />
                      {/* 其他功能页面 */}
                      <Route path="/other-functions" element={<ProtectedRoute><OtherFunctions /></ProtectedRoute>} />
                      <Route path="/" element={<Navigate to="/home" replace />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
