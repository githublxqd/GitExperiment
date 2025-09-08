/**
 * 应用入口文件
 * 负责将React组件挂载到DOM中
 * 使用的技术：
 * - React: 用于构建用户界面的JavaScript库
 * - React DOM: React的DOM渲染器
 * - SWRConfig: SWR库的配置提供者，用于全局配置数据请求
 */
import { StrictMode } from 'react'; // React的严格模式，用于检测潜在问题
import { createRoot } from 'react-dom/client'; // 创建React根节点的函数
import './index.css'; // 全局样式
import App from './App.tsx'; // 应用根组件
import SWRConfig, { swrConfig } from './lib/swrConfig.ts'; // SWR配置和提供者组件

// 获取DOM元素并创建React根节点
const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

// 渲染应用
root.render(
  <StrictMode> {/* 启用严格模式 */}
    <SWRConfig value={swrConfig}> {/* 提供SWR全局配置 */}
      <App /> {/* 渲染根组件 */}
    </SWRConfig>
  </StrictMode>
);
