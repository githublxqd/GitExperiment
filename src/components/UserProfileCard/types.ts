/**
 * 用户数据接口定义
 * 描述从API获取的用户信息结构
 */
export interface IUserData {
  id: string; // 用户唯一标识符
  name: string; // 用户名
  email: string; // 用户邮箱
  avatar?: string; // 用户头像URL（可选）
  bio?: string; // 用户简介（可选）
  location?: string; // 用户所在地（可选）
  website?: string; // 用户网站URL（可选）
  createdAt?: string; // 用户创建时间（ISO格式，可选）
}

/**
 * 用户资料卡片组件Props接口
 * 定义组件接收的属性
 * 使用的技术：
 * - TypeScript接口: 用于类型安全的组件属性定义
 */
export interface IUserProfileCardProps {
  userId: string; // 用户ID，用于从API获取用户数据
}