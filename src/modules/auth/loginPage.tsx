import React, { useState, useEffect } from 'react';
import { 
  faUser, 
  faLock, 
  faEye, 
  faEyeSlash, 
  faSignIn,
  faServer, 
  faCircle, 
  faCheckCircle,
  faHistory, // 新增图标用于最近用户
  faTimes // 新增图标用于清除
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import loginAPI from '../../utils/auth';
import AppNotification, { type NotificationType } from '../../components/AppNotification';

type NotificationState = {
  visible: boolean;
  message: string;
  type: NotificationType;
};

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    message: '',
    type: 'info'
  });
  const [showRecentUsers, setShowRecentUsers] = useState(false);
  const [recentUsers, setRecentUsers] = useState<string[]>([]);
  const navigate = useNavigate();

  // 页面加载时读取本地存储
  useEffect(() => {
    // 获取最近登录的用户列表
    const users = loginAPI.getRecentUsers();
    setRecentUsers(users);
    
    // 如果有最近用户且当前没有输入用户名，使用第一个用户
    if (users.length > 0 && !username) {
      setUsername(users[0]);
    }
  }, []);

  // 表单验证
  useEffect(() => {
    setValid(Boolean(username.trim() && password.trim()));
  }, [username, password]);

  // 显示通知
  const showNotification = (message: string, type: NotificationType = 'info') => {
    setNotification({
      visible: true,
      message,
      type
    });
  };

  // 关闭通知
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  // 处理登录
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!valid) return;
    
    setIsLoading(true);
    
    try {
      // 调用真实的登录API
      const response = await loginAPI.login(username, password);
      
      if (response.code === 200 && response.data) {
        // 保存记住的用户到最近登录列表
        loginAPI.saveRecentUser(username);
        
        // 显示成功提示
        showNotification('登录成功', 'success');
        
        // 延迟跳转，以便用户看到成功提示
        setTimeout(() => {
          navigate('/es-sync');
        }, 1000);
      } else {
        showNotification(response.msg || '登录失败', 'error');
      }
    } catch (error) {
      console.error('登录失败:', error);
      showNotification('登录失败，请重试', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 选择最近的用户
  const selectRecentUser = (user) => {
    setUsername(user);
    setShowRecentUsers(false);
    // 自动聚焦到密码输入框
    setTimeout(() => {
      document.getElementById('password')?.focus();
    }, 100);
  };
  
  // 清除最近用户
  const clearRecentUser = (e, user) => {
    e.stopPropagation();
    const updatedUsers = recentUsers.filter(u => u !== user);
    setRecentUsers(updatedUsers);
    localStorage.setItem('recentUsers', JSON.stringify(updatedUsers));
  };

  return (
    // 修改外层容器样式，添加渐变背景和装饰元素
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      zIndex: 1000,
      overflow: 'auto',
      // 添加渐变背景
      backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }}>
      {/* 装饰元素 - 左上 */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        background: 'rgba(59, 130, 246, 0.1)',
        zIndex: 0,
        animation: 'float 8s ease-in-out infinite'
      }}></div>
      
      {/* 装饰元素 - 右下 */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'rgba(16, 185, 129, 0.1)',
        zIndex: 0,
        animation: 'float 10s ease-in-out infinite reverse'
      }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          {/* 添加Logo和标题组合 */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg transform transition-transform hover:scale-105">
              <FontAwesomeIcon icon={faServer} className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">teapot管理系统</h1>
            <p className="text-gray-500">请输入您的账号信息进行登录</p>
          </div>
        </div>
        
        {/* 添加卡片阴影和悬停效果 */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* 用户名输入 - 添加标签动画和最近用户选择 */}
            <div className="form-group relative">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 transform transition-colors duration-200">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5 transition-colors duration-200 focus-within:text-blue-500" />
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => recentUsers.length > 0 && setShowRecentUsers(true)}
                  onBlur={() => setTimeout(() => setShowRecentUsers(false), 200)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="请输入用户名"
                  autoComplete="username"
                  disabled={isLoading}
                />
                {recentUsers.length > 0 && (
                  <div 
                    className="absolute right-0 inset-y-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                    onClick={() => setShowRecentUsers(!showRecentUsers)}
                  >
                    <FontAwesomeIcon icon={faHistory} className="h-5 w-5" />
                  </div>
                )}
              </div>
              
              {/* 最近用户下拉列表 */}
              {showRecentUsers && recentUsers.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-200 py-1">
                  {recentUsers.map((user, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => selectRecentUser(user)}
                    >
                      <span className="flex items-center">
                        <FontAwesomeIcon icon={faUser} className="h-4 w-4 mr-2 text-gray-400" />
                        {user}
                      </span>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-red-500"
                        onClick={(e) => clearRecentUser(e, user)}
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* 密码输入 */}
            <div className="form-group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 transition-colors duration-200">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faLock} className="h-5 w-5 transition-colors duration-200" />
                </div>
                <input
                  type={showPwd ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                {/* 密码显示切换按钮 */}
                <div
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                  style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
                >
                  <FontAwesomeIcon icon={showPwd ? faEyeSlash : faEye} className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            {/* 记住密码和忘记密码 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={() => setRemember(!remember)}
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                  disabled={isLoading}
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  记住密码
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200 flex items-center">
                忘记密码?
                <span className="ml-1 inline-block transition-transform duration-200 hover:translate-x-0.5">→</span>
              </a>
            </div>
            
            {/* 登录按钮 - 优化样式和动画 */}
            <button
              type="submit"
              disabled={!valid || isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:translate-y-[-2px] ${valid && !isLoading ? 'hover:shadow-lg' : ''} ${valid ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <FontAwesomeIcon icon={faSignIn} className="mr-2 h-5 w-5" />
              )}
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>
          
          {/* 注册链接 - 添加分隔线和动画 */}
          <div className="mt-8 text-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute border-t border-gray-200 w-full"></div>
              <div className="relative px-4 bg-white text-sm text-gray-500">
                还没有账号?
              </div>
            </div>
            <a href="#" className="mt-4 inline-block text-blue-600 font-medium hover:text-blue-500 transition-all duration-200 transform hover:scale-105">
              立即注册
            </a>
          </div>
        </div>
        
        {/* 页脚 - 添加图标 */}
        <div className="mt-8 text-center text-sm text-gray-500 flex flex-col items-center">
          <p className="flex items-center">
            <FontAwesomeIcon icon={faServer} className="h-3 w-3 mr-1 text-gray-400" />
            &copy; {new Date().getFullYear()} teapot管理系统
          </p>
          <p className="mt-1 text-xs text-gray-400">高效管理，便捷操作</p>
        </div>
      </div>
      
      {/* 通知组件 */}
      <AppNotification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onClose={closeNotification}
      />
    </div>
  );
};

export default LoginPage;
