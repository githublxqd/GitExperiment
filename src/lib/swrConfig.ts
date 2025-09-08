/**
 * SWR配置文件
 * 提供全局SWR配置和默认选项
 * 用于在应用级别配置SWR库的行为
 * 使用的技术：
 * - SWR: 用于数据获取的React Hooks库
 * - TypeScript: 提供类型安全
 */
import { SWRConfig } from 'swr'; // SWR配置组件
import { fetchUserData } from './api'; // 自定义的数据获取函数

export const swrConfig = {
  fetcher: fetchUserData, // 数据获取函数，使用我们自定义的fetchUserData
  revalidateOnFocus: false, // 当页面重新聚焦时不重新验证数据
  dedupingInterval: 10000, // 10秒内不会重复发送相同的请求
  refreshInterval: 0, // 不自动定期刷新数据
  errorRetryCount: 3, // 请求失败时重试的次数
  errorRetryInterval: 5000, // 重试间隔时间（毫秒）
  onError: (error: any) => {
    console.error('SWR请求错误:', error); // 错误处理函数
  },
};

/**
 * 导出SWR配置组件，方便在应用中使用
 */
export default SWRConfig;