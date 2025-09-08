/**
 * SWR配置文件
 * 提供全局SWR配置和默认选项
 */
import { SWRConfig } from 'swr';
import { fetchUserData } from './api';

export const swrConfig = {
  fetcher: fetchUserData,
  revalidateOnFocus: false,
  dedupingInterval: 10000, // 10秒内不会重复请求
  refreshInterval: 0, // 不自动刷新
  errorRetryCount: 3, // 错误重试次数
  errorRetryInterval: 5000, // 错误重试间隔（毫秒）
  onError: (error: any) => {
    console.error('SWR请求错误:', error);
  },
};

/**
 * 导出SWR配置组件，方便在应用中使用
 */
export default SWRConfig;