import { md5 } from 'js-md5';
import { decodeToken, isExpired } from 'react-jwt';
import { get } from '../services/client';
import type { RemoteResponse } from '../types/response';

type UserPayload = {
  phoneNumber?: string;
  user_id?: number;
  user_name?: string;
  groupId?: number;
  alias?: string;
  exp?: number;
  email?: string;
  group?: string;
  timestamp?: number;
};

/**
 * 用户信息类
 * 基于JWT token的payload结构
 */
export class UserInfo {
  phoneNumber: string;
  user_id: number;
  user_name: string;
  groupId: number;
  alias: string;
  exp: number;
  email: string;
  group: string;
  timestamp: number;

  /**
   * @param userData - 用户数据对象
   */
  constructor(userData: UserPayload = {}) {
    this.phoneNumber = userData.phoneNumber || '';
    this.user_id = userData.user_id || 0;
    this.user_name = userData.user_name || '';
    this.groupId = userData.groupId || 0;
    this.alias = userData.alias || '';
    this.exp = userData.exp || 0;
    this.email = userData.email || '';
    this.group = userData.group || '';
    this.timestamp = userData.timestamp || Date.now();
  }

  /**
   * 判断token是否已过期
   */
  isExpired(): boolean {
    return this.exp > 0 && Date.now() > this.exp * 1000;
  }

  /**
   * 获取用户显示名称（优先使用别名）
   */
  getDisplayName(): string {
    return this.alias || this.user_name || '未知用户';
  }

  /**
   * 转换为JSON对象
   */
  toJSON(): UserPayload {
    return {
      phoneNumber: this.phoneNumber,
      user_id: this.user_id,
      user_name: this.user_name,
      groupId: this.groupId,
      alias: this.alias,
      exp: this.exp,
      email: this.email,
      group: this.group,
      timestamp: this.timestamp
    };
  }
}

/**
 * JWT解码函数（使用react-jwt库）
 * @param token - JWT token
 * @returns 解码后的用户信息对象或null
 */
const decodeJWT = (token: string): UserInfo | null => {
  try {
    if (!token) {
      console.error('无效的token: 空值');
      return null;
    }

    if (!token.includes('.')) {
      console.error('无效的JWT格式');
      return null;
    }

    const userData = decodeToken<UserPayload>(token);
    if (!userData) {
      console.error('JWT解码结果为空');
      return null;
    }

    return new UserInfo(userData);
  } catch (error) {
    console.error('JWT解析失败:', error);
    return null;
  }
};

/**
 * 检查JWT是否已过期（使用react-jwt库）
 */
const checkTokenExpired = (token: string): boolean => {
  try {
    return isExpired(token);
  } catch (error) {
    console.error('检查token过期状态失败:', error);
    return true;
  }
};

const getLoginHost = () => {
  return import.meta.env.VITE_LOGIN_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? '';
};

/**
 * 登录API
 */
export const loginAPI = {
  /**
   * 用户登录
   * @param username - 用户名
   * @param password - 密码
   */
  login: async (username: string, password: string): Promise<RemoteResponse<string>> => {
    const encryptedPassword = md5(password);
    const params = {
      userName: username,
      password: encryptedPassword
    };

    try {
      const loginUrl = `${getLoginHost()}/login`;
      const response = await get<RemoteResponse<string>>(loginUrl, params);

      if (response.code === 200 && response.data) {
        localStorage.setItem('token', response.data);
        const userInfo = decodeJWT(response.data);
        if (userInfo) {
          localStorage.setItem('currentUser', JSON.stringify(userInfo.toJSON()));
          loginAPI.saveRecentUser(username);
        }
      }

      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  /**
   * 用户退出登录
   * 清除所有登录相关信息
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },

  /**
   * 获取当前登录用户信息
   */
  getCurrentUser: (): UserInfo | null => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        if (checkTokenExpired(token)) {
          console.warn('Token已过期');
          loginAPI.logout();
          return null;
        }

        const cachedUser = localStorage.getItem('currentUser');
        if (cachedUser) {
          try {
            const userData = JSON.parse(cachedUser) as UserPayload;
            const userInfo = new UserInfo(userData);
            if (!userInfo.isExpired()) {
              return userInfo;
            }
          } catch (cacheError) {
            console.warn('解析缓存用户信息失败:', cacheError);
          }
        }

        const userInfo = decodeJWT(token);
        if (userInfo && !userInfo.isExpired()) {
          localStorage.setItem('currentUser', JSON.stringify(userInfo.toJSON()));
          return userInfo;
        }
      }
      return null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  },

  /**
   * 保存用户到最近登录列表
   */
  saveRecentUser: (username: string): void => {
    try {
      const recentUsers = JSON.parse(localStorage.getItem('recentUsers') || '[]') as string[];
      const existingIndex = recentUsers.indexOf(username);
      if (existingIndex > -1) {
        recentUsers.splice(existingIndex, 1);
      }

      recentUsers.unshift(username);
      if (recentUsers.length > 5) {
        recentUsers.splice(5);
      }

      localStorage.setItem('recentUsers', JSON.stringify(recentUsers));
    } catch (error) {
      console.error('保存最近用户失败:', error);
    }
  },

  /**
   * 获取最近登录的用户列表
   */
  getRecentUsers: (): string[] => {
    try {
      return JSON.parse(localStorage.getItem('recentUsers') || '[]') as string[];
    } catch (error) {
      console.error('获取最近用户列表失败:', error);
      return [];
    }
  },

  /**
   * 轻量验证JWT token（仅校验解码与过期）
   */
  verifyToken: (token: string): boolean => {
    const userInfo = decodeJWT(token);
    return Boolean(userInfo && !userInfo.isExpired());
  }
};

export default loginAPI;
