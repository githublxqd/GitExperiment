/**
 * API请求配置文件
 * 提供统一的API请求功能、错误处理和模拟数据
 * 使用的技术：
 * - Fetch API: 用于发送HTTP请求
 * - 环境变量: 区分开发和生产环境
 * - Promise: 处理异步操作
 */
import type { IUserData } from '../components/UserProfileCard/types'; // 导入用户数据类型定义

/**
 * API基础URL
 * 在开发环境中，我们使用模拟数据，不需要基础URL
 * 在生产环境中，这将指向实际的API端点
 *
 * @see https://vitejs.dev/guide/env-and-mode.html Vite环境变量文档
 */
const API_BASE_URL = import.meta.env.PROD ? '/api' : ''; // 使用Vite环境变量区分环境

/**
 * 模拟用户数据
 * 在开发环境中或API不可用时使用
 * 用于前端开发和测试，无需依赖实际后端API
 *
 * @type {Record<string, IUserData>} - 以用户ID为键，用户数据对象为值的映射
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
 * 用于SWR库的数据获取，支持开发环境的模拟数据和生产环境的实际API请求
 * 使用的技术：
 * - 异步函数(async/await): 处理异步操作
 * - Fetch API: 发送HTTP请求
 * - Promise: 处理异步结果
 *
 * @param {string} url - API请求URL，格式为`/user/:id`
 * @returns {Promise<IUserData>} - 返回用户数据的Promise
 * @throws {Error} - 当API请求失败时抛出错误
 */
export const fetchUserData = async (url: string): Promise<IUserData> => {
  // 从URL中提取用户ID
  // 假设URL格式为`/user/:id`，我们取最后一部分作为用户ID
  const userId = url.split('/').pop() || '';
  
  try {
    // 检查是否在生产环境
    // 在生产环境中，我们发送实际的API请求
    // 在开发环境中，我们使用模拟数据
    if (import.meta.env.PROD) {
        // 生产环境: 发送实际API请求
        const response = await fetch(`${API_BASE_URL}${url}`);
        
        // 检查响应状态
        if (!response.ok) {
          // 如果响应状态不是2xx，抛出错误
          throw new Error(`API请求失败: ${response.status}`);
        }
        
        // 解析并返回JSON响应
        return await response.json();
      } else {
      // 开发环境: 使用模拟数据
        // 模拟网络延迟，使开发体验更接近真实环境
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 检查是否存在对应ID的模拟数据
        if (MOCK_USER_DATA[userId]) {
          // 如果存在，返回模拟数据
          return MOCK_USER_DATA[userId];
        } else {
          // 如果没有对应的模拟数据，创建一个默认用户
          // 这确保即使请求了不存在的用户ID，也能返回有效的用户对象
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
      // 捕获并记录错误
      console.error('获取用户数据失败:', error);
      // 重新抛出错误，让调用者处理
      throw error;
    }
  };

/**
 * SWR配置对象
 * 提供默认的获取器和其他配置选项
 * 用于在main.tsx中配置全局SWR
 *
 * @see https://swr.vercel.app/docs/api SWR API文档
 */
export const swrConfig = {
  fetcher: fetchUserData, // 设置我们自定义的fetch函数
  revalidateOnFocus: false, // 聚焦时不重新验证数据
  dedupingInterval: 10000, // 10秒内不会重复请求
  refreshInterval: 0, // 不自动刷新
  errorRetryCount: 3, // 错误重试次数
  errorRetryInterval: 5000, // 错误重试间隔（毫秒）
  onError: (error: any) => {
    console.error('SWR请求错误:', error);
  },
};