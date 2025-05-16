// src/context/CryptoDataContext.js  15-05-2025 11:46pm
import React, { createContext, useState, useContext, useEffect } from 'react';

// 가상 데이터 생성을 위한 유틸 함수
const generateDummyCoins = () => {
  const coins = [
    { name: '비트코인', symbol: 'BTC', market: 'KRW' },
    { name: '이더리움', symbol: 'ETH', market: 'KRW' },
    { name: '리플', symbol: 'XRP', market: 'KRW' },
    { name: '에이다', symbol: 'ADA', market: 'KRW' },
    { name: '도지코인', symbol: 'DOGE', market: 'KRW' },
    { name: '솔라나', symbol: 'SOL', market: 'KRW' },
    { name: '폴카닷', symbol: 'DOT', market: 'KRW' },
    { name: '라이트코인', symbol: 'LTC', market: 'KRW' },
    { name: '체인링크', symbol: 'LINK', market: 'KRW' },
    { name: '카르다노', symbol: 'ADA', market: 'BTC' },
    { name: '이더리움', symbol: 'ETH', market: 'BTC' },
    { name: '비트코인캐시', symbol: 'BCH', market: 'KRW' },
    { name: '아발란체', symbol: 'AVAX', market: 'KRW' },
    { name: '폴리곤', symbol: 'MATIC', market: 'KRW' },
    { name: '트론', symbol: 'TRX', market: 'KRW' },
  ];

  return coins.map(coin => {
    const price = coin.symbol === 'BTC' 
      ? Math.random() * 50000000 + 100000000 
      : Math.random() * 1000000 + 10000;
    
    const change = (Math.random() * 8 - 4); // -4% ~ 4%
    const volume = Math.random() * 10000000000;
    const isFavorite = Math.random() > 0.8; // 20% 확률로 즐겨찾기

    return {
      ...coin,
      price: Math.round(price),
      change,
      volume,
      isFavorite
    };
  });
};

// 차트 데이터 생성 함수
const generateChartData = (symbol, timeRange) => {
  const now = new Date();
  const data = [];
  const intervals = timeRange === '1d' ? 24 : 30;
  
  let basePrice = symbol === 'BTC' ? 144000000 : 1000000;
  let prevClose = basePrice;
  
  for (let i = 0; i < intervals; i++) {
    const time = new Date(now);
    
    if (timeRange === '30m') time.setMinutes(time.getMinutes() - (intervals - i) * 30);
    else if (timeRange === '1h') time.setHours(time.getHours() - (intervals - i));
    else if (timeRange === '4h') time.setHours(time.getHours() - (intervals - i) * 4);
    else if (timeRange === '1d') time.setDate(time.getDate() - (intervals - i));
    else if (timeRange === '1w') time.setDate(time.getDate() - (intervals - i) * 7);
    else if (timeRange === '1M') time.setMonth(time.getMonth() - (intervals - i));
    
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

// Context 생성
const CryptoDataContext = createContext();

// Context Provider 컴포넌트
export const CryptoDataProvider = ({ children }) => {
  const [coinList, setCoinList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 실제 앱에서는 API 호출을 하겠지만, 여기서는 가상 데이터 생성
    const fetchCoins = () => {
      setIsLoading(true);
      // API 호출 대신 가상 데이터 생성
      const dummyCoins = generateDummyCoins();
      setCoinList(dummyCoins);
      setIsLoading(false);
    };

    fetchCoins();
    
    // 실시간 업데이트 시뮬레이션 (3초마다)
    const interval = setInterval(() => {
      setCoinList(prevList => {
        return prevList.map(coin => {
          const changeDirection = Math.random() > 0.5 ? 1 : -1;
          const changeAmount = Math.random() * 0.5; // 최대 0.5% 변화
          const newChange = coin.change + (changeDirection * changeAmount);
          const newPrice = Math.round(coin.price * (1 + newChange / 100));
          
          return {
            ...coin,
            price: newPrice,
            change: newChange
          };
        });
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 캔들 데이터 가져오기 함수
  const getCandleData = async (symbol, timeRange) => {
    // 실제 앱에서는 API 호출
    return generateChartData(symbol, timeRange);
  };

  // 실시간 가격 가져오기 함수
  const getRealtimePrice = async (symbol) => {
    // 실제 앱에서는 API 호출
    const coin = coinList.find(c => `${c.symbol}/${c.market}` === symbol);
    if (!coin) {
      const defaultPrice = symbol.includes('BTC') ? 145000000 : 1000000;
      return {
        price: defaultPrice,
        change: -0.5,
        changePercent: -0.5
      };
    }
    
    return {
      price: coin.price,
      change: Math.round(coin.price * (coin.change / 100)),
      changePercent: coin.change
    };
  };

  const value = {
    coinList,
    isLoading,
    getCandleData,
    getRealtimePrice
  };

  return (
    <CryptoDataContext.Provider value={value}>
      {children}
    </CryptoDataContext.Provider>
  );
};

// 커스텀 Hook
export const useCryptoData = () => {
  const context = useContext(CryptoDataContext);
  if (context === undefined) {
    throw new Error('useCryptoData must be used within a CryptoDataProvider');
  }
  return context;
};

export default CryptoDataContext;
