import React, { useState, useEffect } from 'react';
import './TradeHistory.css';

const TradeHistory = ({ symbol, tradeData = [] }) => {
  const [trades, setTrades] = useState([]);
  const [filter, setFilter] = useState('all');  // 'all', 'buy', 'sell'
  
  // 거래 데이터 처리
  useEffect(() => {
    if (!tradeData || !tradeData.length) {
      // 더미 데이터 생성
      const dummyTrades = generateDummyTrades();
      processTrades(dummyTrades);
    } else {
      processTrades(tradeData);
    }
  }, [tradeData, filter]);
  
  // 거래 데이터 처리 및 필터링
  const processTrades = (data) => {
    // 필터링 적용
    let filteredTrades = [...data];
    if (filter === 'buy') {
      filteredTrades = filteredTrades.filter(trade => trade.side === 'buy');
    } else if (filter === 'sell') {
      filteredTrades = filteredTrades.filter(trade => trade.side === 'sell');
    }
    
    // 최신순 정렬
    filteredTrades.sort((a, b) => b.timestamp - a.timestamp);
    
    // 최대 50개 표시
    setTrades(filteredTrades.slice(0, 50));
  };
  
  // 더미 데이터 생성 (실제 앱에서는 제거)
  const generateDummyTrades = () => {
    const basePrice = 144000000;
    const dummyTrades = [];
    const sides = ['buy', 'sell'];
    const now = Date.now();
    
    for (let i = 0; i < 100; i++) {
      const priceDelta = Math.random() * 100000 - 50000;
      const side = sides[Math.floor(Math.random() * sides.length)];
      const price = basePrice + priceDelta;
      
      dummyTrades.push({
        id: `trade-${i}`,
        price,
        amount: Math.random() * 2,
        side,
        timestamp: now - (i * 30000) - Math.floor(Math.random() * 30000),
        symbol: symbol || 'BTC/KRW'
      });
    }
    
    return dummyTrades;
  };
  
  // 가격 포맷팅
  const formatPrice = (price) => {
    return price.toLocaleString();
  };
  
  // 수량 포맷팅
  const formatAmount = (amount) => {
    return amount.toFixed(8);
  };
  
  // 시간 포맷팅
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  // 필터 변경 핸들러
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  return (
    <div className="trade-history">
      <div className="trade-history-header">
        <h3 className="trade-history-title">체결</h3>
        
        <div className="filter-controls">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            전체
          </button>
          <button 
            className={`filter-button ${filter === 'buy' ? 'active' : ''}`}
            onClick={() => handleFilterChange('buy')}
          >
            매수
          </button>
          <button 
            className={`filter-button ${filter === 'sell' ? 'active' : ''}`}
            onClick={() => handleFilterChange('sell')}
          >
            매도
          </button>
        </div>
      </div>
      
      <div className="trade-list-container">
        <div className="trade-header">
          <span className="time-header">시간</span>
          <span className="price-header">가격(KRW)</span>
          <span className="amount-header">{symbol ? symbol.split('/')[0] : 'BTC'} 수량</span>
        </div>
        
        <div className="trade-list">
          {trades.length > 0 ? (
            trades.map((trade) => (
              <div 
                key={trade.id} 
                className={`trade-item ${trade.side === 'buy' ? 'buy' : 'sell'}`}
              >
                <span className="trade-time">{formatTime(trade.timestamp)}</span>
                <span className={`trade-price ${trade.side === 'buy' ? 'price-up' : 'price-down'}`}>
                  {formatPrice(trade.price)}
                </span>
                <span className="trade-amount">{formatAmount(trade.amount)}</span>
              </div>
            ))
          ) : (
            <div className="empty-trades">
              <p>체결된 거래가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;
