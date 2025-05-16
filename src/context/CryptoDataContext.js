import React, { createContext, useState, useContext } from 'react';

// 가상화폐 데이터 컨텍스트 생성
export const CryptoDataContext = createContext();

// 컨텍스트 훅
export const useCryptoData = () => useContext(CryptoDataContext);

export const CryptoDataProvider = ({ children }) => {
  // 코인 데이터 상태
  const [cryptoData, setCryptoData] = useState({});
  
  // 차트 데이터 가져오기 (더미 데이터 생성)
  const getCandleData = async (symbol, timeframe) => {
    // 실제 API 호출 대신 더미 데이터 생성
    return generateDummyData(timeframe);
  };
  
  // 실시간 가격 가져오기 (더미 데이터)
  const getRealtimePrice = async (symbol) => {
    // 더미 데이터 반환
    return {
      price: 144313000,
      change: -651000,
      changePercent: -0.45
    };
  };
  
  // 더미 데이터 생성 함수
  const generateDummyData = (range) => {
    const now = new Date();
    const data = [];
    const intervals = range === '1d' ? 24 : 30;
    
    let basePrice = 144000000;
    let prevClose = basePrice;
    
    for (let i = 0; i < intervals; i++) {
      const time = new Date(now);
      
      if (range === '30m') time.setMinutes(time.getMinutes() - (intervals - i) * 30);
      else if (range === '1h') time.setHours(time.getHours() - (intervals - i));
      else if (range === '4h') time.setHours(time.getHours() - (intervals - i) * 4);
      else if (range === '1d') time.setDate(time.getDate() - (intervals - i));
      else if (range === '1w') time.setDate(time.getDate() - (intervals - i) * 7);
      else if (range === '1M') time.setMonth(time.getMonth() - (intervals - i));
      
      const variance = Math.random() * 0.03 - 0.015; // -1.5% to +1.5%
      const change = prevClose * variance;
      
      const open = prevClose;
      const close = Math.round(open + change);
      const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.01));
      const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.01));
      const volume = Math.round(Math.random() * 50000000 + 50000000);
      
      data.push({
        time: time.toISOString(),
        timeLabel: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateLabel: time.toLocaleDateString(),
        open,
        high,
        low,
        close,
        volume,
        ma5: Math.round(basePrice * (1 + (Math.sin(i * 0.2) * 0.02))),
        ma20: Math.round(basePrice * (1 + (Math.cos(i * 0.1) * 0.01)))
      });
      
      prevClose = close;
    }
    
    return data;
  };

  return (
    <CryptoDataContext.Provider
      value={{
        cryptoData,
        setCryptoData,
        getCandleData,
        getRealtimePrice
      }}
    >
      {children}
    </CryptoDataContext.Provider>
  );
};