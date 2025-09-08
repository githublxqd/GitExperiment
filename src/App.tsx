import { useState } from 'react';
import UserProfileCard from './components/UserProfileCard';
import './App.css';

/**
 * 应用主组件
 * 包含用户ID输入和用户资料卡片展示
 */
function App() {
  // 存储用户输入的用户ID
  const [userId, setUserId] = useState<string>('1'); // 默认使用用户ID 1

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>用户资料卡片</h1>
      </header>
      
      <main className="app-main">
        {/* 用户ID输入区域 */}
        <div className="input-section">
          <label htmlFor="userId" className="input-label">
            输入用户ID: 
          </label>
          <input
            id="userId"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="userId-input"
            placeholder="请输入用户ID"
          />
        </div>
        
        {/* 用户资料卡片区域 */}
        <div className="card-section">
          {userId.trim() ? (
            <UserProfileCard userId={userId.trim()} />
          ) : (
            <div className="empty-card">
              <p>请输入有效的用户ID</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
