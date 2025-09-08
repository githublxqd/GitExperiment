import React from 'react';
import useSWR from 'swr';
import styles from './UserProfileCard.module.css';
import type { IUserProfileCardProps, IUserData } from './types';

/**
 * 用户资料卡片组件
 * 通过userId从API获取用户数据并展示
 * 包含加载中和加载失败状态的处理
 */
const UserProfileCard: React.FC<IUserProfileCardProps> = ({ userId }) => {
  // 使用SWR获取用户数据
  // 由于我们在main.tsx中已经配置了全局SWRConfig，这里可以直接使用简化的调用方式
  const { data, error, isLoading } = useSWR<IUserData>(`/user/${userId}`);

  // 处理加载中状态
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

  // 处理加载失败状态
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

  // 处理数据为空的情况
  if (!data) {
    return (
      <div className={styles.card}>
        <div className={styles.emptyContainer}>
          <p className={styles.emptyText}>未找到用户资料</p>
        </div>
      </div>
    );
  }

  // 渲染用户资料卡片
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {data.avatar ? (
          <img 
            src={data.avatar} 
            alt={`${data.name}'s avatar`} 
            className={styles.avatar}
            onError={(e) => {
              // 头像加载失败时显示默认头像
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/150';
            }}
          />
        ) : (
          <div className={styles.defaultAvatar}>
            <span className={styles.avatarInitials}>
              {data.name ? data.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        )}
        <div className={styles.userInfo}>
          <h2 className={styles.userName}>{data.name}</h2>
          <p className={styles.userEmail}>{data.email}</p>
        </div>
      </div>
      
      {data.bio && (
        <p className={styles.userBio}>{data.bio}</p>
      )}
      
      <div className={styles.userDetails}>
        {data.location && (
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>位置:</span>
            <span className={styles.detailValue}>{data.location}</span>
          </div>
        )}
        {data.website && (
          <div className={styles.detailItem}>
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
          <div className={styles.detailItem}>
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