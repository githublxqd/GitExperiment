/**
 * API请求配置文件
 * 提供统一的API请求功能和错误处理
 */
import type { IUserData } from '../components/UserProfileCard/types';

/**
 * API基础URL
 * 在开发环境中，我们使用模拟数据
 * 在生产环境中，这将指向实际的API端点
 */
const API_BASE_URL = import.meta.env.PROD ? '/api' : '';

/**
 * 模拟用户数据
 * 在API不可用或开发环境中使用
 */
const MOCK_USER_DATA: Record<string, IUserData> = {
  '1': {
    id: '1',
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://via.placeholder.com/150?text=ZS',
    bio: '热爱技术的前端开发者，喜欢React和TypeScript。',
    location: '北京',
    website: 'https://example.com/zhangsan',
    createdAt: '2020-01-15T08:00:00Z'
  },
  '2': {
    id: '2',
    name: '李四',
    email: 'lisi@example.com',
    avatar: 'https://via.placeholder.com/150?text=LS',
    bio: '全栈开发者，热衷于解决复杂的技术问题。',
    location: '上海',
    website: 'https://example.com/lisi',
    createdAt: '2019-05-20T10:30:00Z'
  },
  '3': {
    id: '3',
    name: '王五',
    email: 'wangwu@example.com',
    bio: 'UI/UX设计师，追求极致的用户体验。',
    location: '广州',
    createdAt: '2021-03-10T14:20:00Z'
  }
};

/**
 * 获取用户数据的函数
 * 用于SWR库的数据获取
 * @param url - API请求URL
 * @returns Promise<IUserData>
 */
export const fetchUserData = async (url: string): Promise<IUserData> => {
  // 从URL中提取用户ID
  const userId = url.split('/').pop() || '';
  
  try {
    // 检查是否在生产环境，如果是则发送实际API请求
    if (import.meta.env.PROD) {
      const response = await fetch(`${API_BASE_URL}${url}`);
      
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }
      
      return await response.json();
    } else {
      // 在开发环境中，使用模拟数据
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 检查是否存在模拟数据
      if (MOCK_USER_DATA[userId]) {
        return MOCK_USER_DATA[userId];
      } else {
        // 如果没有对应的模拟数据，创建一个默认用户
        return {
          id: userId,
          name: `用户${userId}`,
          email: `user${userId}@example.com`,
          bio: '这是一个默认用户资料',
          location: '未知',
          createdAt: new Date().toISOString()
        };
      }
    }
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw error;
  }
};

/**
 * 创建SWR配置对象
 * 提供默认的获取器和错误处理
 */
export const swrConfig = {
  fetcher: fetchUserData
};