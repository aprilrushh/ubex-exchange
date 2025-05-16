import React, { useState, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import './WalletPage.css';

const WalletPage = () => {
  const { getBalance } = useMarket();
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // API 호출 대신 더미 데이터 사용
      const dummyBalance = getBalance();
      setBalance(dummyBalance);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setError('잔액을 불러오는데 실패했습니다.');
    }
  }, [getBalance]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!balance) {
    return <div className="loading">잔액을 불러오는 중...</div>;
  }

  return (
    <div className="wallet-page">
      <h2>내 지갑</h2>
      <div className="balance-grid">
        <div className="balance-card">
          <h3>KRW</h3>
          <p className="amount">{balance.krw.toLocaleString()} KRW</p>
        </div>
        <div className="balance-card">
          <h3>BTC</h3>
          <p className="amount">{balance.btc.toFixed(8)} BTC</p>
        </div>
        <div className="balance-card">
          <h3>ETH</h3>
          <p className="amount">{balance.eth.toFixed(8)} ETH</p>
        </div>
        <div className="balance-card">
          <h3>XRP</h3>
          <p className="amount">{balance.xrp.toLocaleString()} XRP</p>
        </div>
        <div className="balance-card">
          <h3>DOGE</h3>
          <p className="amount">{balance.doge.toLocaleString()} DOGE</p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage; 