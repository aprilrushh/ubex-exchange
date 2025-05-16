import React, { createContext, useState, useEffect } from 'react';

// 시장 데이터 관련 컨텍스트 생성
export const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
  // 코인 리스트 상태
  const [coinList, setCoinList] = useState([]);
  // 현재 선택된 코인 정보
  const [currentCoin, setCurrentCoin] = useState(null);
  // 시장 데이터 (가격, 거래량 등)
  const [marketData, setMarketData] = useState(null);
  // 차트 데이터
  const [marketHistory, setMarketHistory] = useState([]);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 에러 상태
  const [error, setError] = useState(null);

  // 시장 데이터 가져오기 (API 호출 대신 예시 데이터 사용)
  const fetchMarketData = async (symbol) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 실제 API 호출 구현 시 여기에 구현
      // const response = await fetch(`/api/market/${symbol}`);
      // const data = await response.json();
      
      // 예시 데이터 (BTC/KRW)
      const exampleData = {
        symbol: 'BTC/KRW',
        price: 144313000,
        high24h: 145186000,
        low24h: 144037000,
        volume24h: 1346.789,
        volume24hKRW: 194600583627,
        change24h: -651000,
        changePercent24h: -0.45,
        timestamp: new Date().toISOString()
      };
      
      // 차트 데이터 생성 (예시)
      const historyData = generateExampleChartData(symbol);
      
      setTimeout(() => {
        setMarketData(exampleData);
        setMarketHistory(historyData);
        setIsLoading(false);
      }, 500); // 실제 API 딜레이 시뮬레이션
    } catch (err) {
      console.error('Market data fetch error:', err);
      setError('시장 데이터를 불러오는 데 실패했습니다.');
      setIsLoading(false);
    }
  };

  // 코인 리스트 가져오기 (API 호출 대신 예시 데이터 사용)
  const fetchCoinList = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 실제 API 호출 구현 시 여기에 구현
      // const response = await fetch('/api/coins');
      // const data = await response.json();
      
      // 예시 데이터
      const exampleCoins = [
        {
          id: 'btc',
          symbol: 'BTC',
          market: 'KRW',
          koreanName: '비트코인',
          englishName: 'Bitcoin',
          price: 144313000,
          changePercent24h: -0.45,
          change24h: -651000,
          volume24hKRW: 194601000000,
          isFavorite: false
        },
        {
          id: 'xrp',
          symbol: 'XRP',
          market: 'KRW',
          koreanName: '리플',
          englishName: 'Ripple',
          price: 3299,
          changePercent24h: -3.45,
          change24h: -118,
          volume24hKRW: 593455000000,
          isFavorite: false
        },
        {
          id: 'doge',
          symbol: 'DOGE',
          market: 'KRW',
          koreanName: '도지코인',
          englishName: 'Dogecoin',
          price: 323.9,
          changePercent24h: -6.63,
          change24h: -23,
          volume24hKRW: 546612000000,
          isFavorite: false
        },
        {
          id: 'eth',
          symbol: 'ETH',
          market: 'KRW',
          koreanName: '이더리움',
          englishName: 'Ethereum',
          price: 3474000,
          changePercent24h: -2.88,
          change24h: -103000,
          volume24hKRW: 392052000000,
          isFavorite: false
        },
        {
          id: 'kaito',
          symbol: 'KAITO',
          market: 'KRW',
          koreanName: '카이토',
          englishName: 'Kaito',
          price: 2407,
          changePercent24h: -8.83,
          change24h: -233,
          volume24hKRW: 286094000000,
          isFavorite: true
        },
        {
          id: 'move',
          symbol: 'MOVE',
          market: 'KRW',
          koreanName: '무브먼트',
          englishName: 'Movement',
          price: 316.3,
          changePercent24h: 10.52,
          change24h: 30.1,
          volume24hKRW: 258020000000,
          isFavorite: false
        },
        {
          id: 'layer',
          symbol: 'LAYER',
          market: 'KRW',
          koreanName: '레이어',
          englishName: 'Layer',
          price: 1667,
          changePercent24h: -5.07,
          change24h: -89,
          volume24hKRW: 190725000000,
          isFavorite: false
        },
        {
          id: 'sol',
          symbol: 'SOL',
          market: 'KRW',
          koreanName: '솔라나',
          englishName: 'Solana',
          price: 241800,
          changePercent24h: -1.81,
          change24h: -4450,
          volume24hKRW: 164722000000,
          isFavorite: true
        }
      ];
      
      setTimeout(() => {
        setCoinList(exampleCoins);
        setIsLoading(false);
      }, 300); // 실제 API 딜레이 시뮬레이션
    } catch (err) {
      console.error('Coin list fetch error:', err);
      setError('코인 목록을 불러오는 데 실패했습니다.');
      setIsLoading(false);
    }
  };

  // 즐겨찾기 토글
  const toggleFavorite = (coinId) => {
    setCoinList(prevList =>
      prevList.map(coin =>
        coin.id === coinId ? { ...coin, isFavorite: !coin.isFavorite } : coin
      )
    );
  };

  // 차트 데이터 생성 (예시)
  const generateExampleChartData = (symbol) => {
    const now = new Date();
    const result = [];
    const basePrice = symbol.includes('BTC') ? 144000000 : 
                     symbol.includes('ETH') ? 3470000 : 
                     symbol.includes('XRP') ? 3300 : 
                     symbol.includes('DOGE') ? 324 : 5000;
    let prevClose = basePrice;
    
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const randomFactor = Math.random() * 0.03 - 0.015; // -1.5% to +1.5%
      const change = prevClose * randomFactor;
      
      const open = prevClose;
      const close = Math.round(open + change);
      const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.01));
      const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.01));
      const volume = Math.round(Math.random() * 1000 + 100);
      
      result.push({
        time: time.getTime() / 1000,
        open,
        high,
        low,
        close,
        volume
      });
      
      prevClose = close;
    }
    
    return result;
  };

  // 컨텍스트 값
  const contextValue = {
    coinList,
    currentCoin,
    setCurrentCoin,
    marketData,
    marketHistory,
    isLoading,
    error,
    fetchMarketData,
    fetchCoinList,
    toggleFavorite
  };

  return (
    <MarketContext.Provider value={contextValue}>
      {children}
    </MarketContext.Provider>
  );
};

export default MarketProvider;
