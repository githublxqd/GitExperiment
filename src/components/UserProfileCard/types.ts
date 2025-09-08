/**
 * 用户数据接口定义
 */
export interface IUserData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  createdAt?: string;
}

/**
 * 用户资料卡片组件Props接口
 */
export interface IUserProfileCardProps {
  userId: string;
}