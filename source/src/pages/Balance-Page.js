// src/pages/BalancePage.js  16-05-2025 12:04am
import React from 'react';
import { useAuth } from '../context/AuthContext';

const BalancePage = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="balance-page">
      <h2>자산 정보</h2>
      
      {isAuthenticated ? (
        <div className="balance-content">
          <div className="balance-card">
            <h3>보유 잔고</h3>
            <div className="balance-row">
              <span>KRW</span>
              <span className="balance-amount">{user?.balance?.KRW?.toLocaleString() || 0} KRW</span>
            </div>
            <div className="balance-row">
              <span>BTC</span>
              <span className="balance-amount">{user?.balance?.BTC || 0} BTC</span>
            </div>
            <div className="balance-row">
              <span>ETH</span>
              <span className="balance-amount">{user?.balance?.ETH || 0} ETH</span>
            </div>
          </div>
        </div>
      ) : (
        <p>자산 정보를 확인하려면 로그인하세요.</p>
      )}
    </div>
  );
};

export default BalancePage;
