/**
 * 用户资料卡片组件
 * 通过userId从API获取用户数据并展示
 * 包含加载中和加载失败状态的处理
 * 使用的技术：
 * - React: 用于构建用户界面的JavaScript库
 * - SWR: 用于数据获取的React Hooks库，提供缓存、重试和重新验证功能
 * - CSS Modules: 用于样式隔离的CSS模块化方案
 */
import React from 'react'; // React核心库
import useSWR from 'swr'; // 数据获取库
import styles from './UserProfileCard.module.css'; // 组件样式（CSS Modules）
import type { IUserProfileCardProps, IUserData } from './types'; // 类型定义
const UserProfileCard: React.FC<IUserProfileCardProps> = ({ userId }) => {
  /**
   * 使用SWR获取用户数据
   * SWR会自动处理缓存、重试和重新验证
   * 我们在main.tsx中已经配置了全局SWRConfig，包含自定义的fetch函数
   *
   * @param `/user/${userId}` - 请求URL，包含用户ID
   * @returns {data, error, isLoading} - SWR返回的状态对象
   */
  const { data, error, isLoading } = useSWR<IUserData>(`/user/${userId}`);

  // 处理加载中状态
  // 当数据正在加载时，显示加载动画
  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>加载用户资料中...</p>
        </div>
      </div>
    );
  }

  /**
   * 处理加载失败状态
   * 当数据请求失败时，显示错误信息和重试按钮
   */
  if (error) {
    return (
      <div className={styles.card}>
        <div className={styles.errorContainer}>
          <p className={styles.errorText}>获取用户资料失败</p>
          <button 
            className={styles.retryButton}
            onClick={() => {
              // 重新验证数据，触发重新请求
              window.location.reload();
            }}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  /**
   * 处理数据为空的情况
   * 当没有获取到用户数据时，显示空状态提示
   */
  if (!data) {
    return (
      <div className={styles.card}>
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>未找到用户资料</p>
        </div>
      </div>
    );
  }

  /**
   * 渲染用户资料卡片
   * 展示用户的详细信息，包括头像、姓名、邮箱、简介等
   */
  return (
    <div className={styles.card}> {/* 卡片容器 */}
      <div className={styles.header}> {/* 卡片头部 */}
        {data.avatar ? (
          <img 
            src={data.avatar} 
            alt={`${data.name}'s avatar`} 
            className={styles.avatar} // 用户头像
            onError={(e) => {
              // 头像加载失败时显示默认头像
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/150';
            }}
          />
        ) : (
          <div className={styles.defaultAvatar}> {/* 默认头像 */}
            <span className={styles.avatarInitials}>
              {data.name ? data.name.charAt(0).toUpperCase() : 'U'} {/* 显示用户名首字母 */}
            </span>
          </div>
        )}
        <div className={styles.userInfo}> {/* 用户基本信息 */}
          <h2 className={styles.userName}>{data.name}</h2> {/* 用户名 */}
          <p className={styles.userEmail}>{data.email}</p> {/* 用户邮箱 */}
        </div>
      </div>
      
      {/* 用户简介部分 - 显示用户的个人简介信息 */}
      {data.bio && (
        <p className={styles.userBio}>{data.bio}</p>
      )}
      
      {/* 用户详细信息部分 - 显示用户的附加信息，如位置、网站和注册时间 */}
      <div className={styles.userDetails}> {/* 用户详细信息容器 */}
          {data.location && (
            <div className={styles.detailItem}> {/* 位置信息项 */}
              <span className={styles.detailLabel}>位置:</span>
              <span className={styles.detailValue}>{data.location}</span>
            </div>
          )}
          {data.website && (
            <div className={styles.detailItem}> {/* 网站信息项 */}
              <span className={styles.detailLabel}>网站:</span>
              <a 
                href={data.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.detailLink}
              >
                {data.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
          {data.createdAt && (
            <div className={styles.detailItem}> {/* 注册时间信息项 */}
              <span className={styles.detailLabel}>注册时间:</span>
              <span className={styles.detailValue}>
                {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
    </div>
  );
};

export default UserProfileCard;