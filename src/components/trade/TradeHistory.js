import React, { useState, useEffect, useMemo } from 'react';
import { useMarket } from '../../context/MarketContext';
import './TradeHistory.css';

const TradeHistory = ({ symbol }) => {
  const { marketData } = useMarket();
  const [trades, setTrades] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // 더미 데이터 생성
  useEffect(() => {
    const generateDummyTrades = () => {
      const dummyTrades = [];
      const now = new Date();
      
      for (let i = 0; i < 20; i++) {
        const time = new Date(now.getTime() - (i * 5 * 60 * 1000)); // 5분 간격
        const price = Math.random() > 0.5 ? 
          marketData[0]?.price * (1 + Math.random() * 0.01) :
          marketData[0]?.price * (1 - Math.random() * 0.01);
        
        dummyTrades.push({
          id: i,
          time: time,
          type: Math.random() > 0.5 ? 'buy' : 'sell',
          price: price,
          amount: (Math.random() * 0.1).toFixed(8),
          total: (price * parseFloat((Math.random() * 0.1).toFixed(8))).toFixed(2)
        });
      }
      
      return dummyTrades;
    };

    setTrades(generateDummyTrades());
  }, [marketData]);

  // 필터링된 거래 내역
  const filteredTrades = useMemo(() => {
    return trades.filter(trade => {
      if (selectedFilter === 'all') return true;
      return trade.type === selectedFilter;
    });
  }, [trades, selectedFilter]);

  // 가격 포맷팅
  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  // 시간 포맷팅
  const formatTime = (time) => {
    return time.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="trade-history">
      <div className="trade-history-header">
        <h3>체결 내역</h3>
        <div className="trade-filters">
          <button
            className={selectedFilter === 'all' ? 'active' : ''}
            onClick={() => setSelectedFilter('all')}
          >
            전체
          </button>
          <button
            className={selectedFilter === 'buy' ? 'active' : ''}
            onClick={() => setSelectedFilter('buy')}
          >
            매수
          </button>
          <button
            className={selectedFilter === 'sell' ? 'active' : ''}
            onClick={() => setSelectedFilter('sell')}
          >
            매도
          </button>
        </div>
      </div>

      <div className="trade-list">
        <div className="trade-list-header">
          <span>시간</span>
          <span>유형</span>
          <span>가격</span>
          <span>수량</span>
          <span>총액</span>
        </div>
        
        <div className="trade-list-body">
          {filteredTrades.map(trade => (
            <div key={trade.id} className={`trade-item ${trade.type}`}>
              <span>{formatTime(trade.time)}</span>
              <span className="trade-type">
                {trade.type === 'buy' ? '매수' : '매도'}
              </span>
              <span>{formatPrice(trade.price)}</span>
              <span>{trade.amount}</span>
              <span>{formatPrice(trade.total)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradeHistory; 