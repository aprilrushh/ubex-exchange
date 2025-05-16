// src/context/MarketContext.js  15-05-2025 11:49pm
import React, { createContext, useState, useContext, useEffect } from 'react';

const MarketContext = createContext();

export const MarketProvider = ({ children }) => {
  const [markets, setMarkets] = useState({
    KRW: [],
    BTC: [],
    USDT: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarket, setSelectedMarket] = useState('KRW');
  const [selectedCoin, setSelectedCoin] = useState(null);

  useEffect(() => {
    // 시장 데이터 가져오기
    const fetchMarkets = async () => {
      setIsLoading(true);
      
      // 실제 앱에서는 API 호출
      // 여기서는 가상 데이터 사용
      setTimeout(() => {
        const krwMarkets = [
          { ticker: 'KRW-BTC', korean_name: '비트코인', english_name: 'Bitcoin', market: 'KRW' },
          { ticker: 'KRW-ETH', korean_name: '이더리움', english_name: 'Ethereum', market: 'KRW' },
          { ticker: 'KRW-XRP', korean_name: '리플', english_name: 'Ripple', market: 'KRW' },
          { ticker: 'KRW-ADA', korean_name: '에이다', english_name: 'Cardano', market: 'KRW' },
          { ticker: 'KRW-DOGE', korean_name: '도지코인', english_name: 'Dogecoin', market: 'KRW' }
        ];
        
        const btcMarkets = [
          { ticker: 'BTC-ETH', korean_name: '이더리움', english_name: 'Ethereum', market: 'BTC' },
          { ticker: 'BTC-XRP', korean_name: '리플', english_name: 'Ripple', market: 'BTC' },
          { ticker: 'BTC-ADA', korean_name: '에이다', english_name: 'Cardano', market: 'BTC' }
        ];
        
        const usdtMarkets = [
          { ticker: 'USDT-BTC', korean_name: '비트코인', english_name: 'Bitcoin', market: 'USDT' },
          { ticker: 'USDT-ETH', korean_name: '이더리움', english_name: 'Ethereum', market: 'USDT' },
          { ticker: 'USDT-XRP', korean_name: '리플', english_name: 'Ripple', market: 'USDT' }
        ];
        
        setMarkets({
          KRW: krwMarkets,
          BTC: btcMarkets,
          USDT: usdtMarkets
        });
        
        // 기본 선택 코인 설정
        if (!selectedCoin) {
          setSelectedCoin(krwMarkets[0]);
        }
        
        setIsLoading(false);
      }, 1000);
    };
    
    fetchMarkets();
  }, [selectedCoin]);

  // 시장 변경 핸들러
  const changeMarket = (market) => {
    setSelectedMarket(market);
    // 새 시장에서 첫 번째 코인 선택
    if (markets[market] && markets[market].length > 0) {
      setSelectedCoin(markets[market][0]);
    } else {
      setSelectedCoin(null);
    }
  };

  // 코인 선택 핸들러
  const selectCoin = (coin) => {
    setSelectedCoin(coin);
  };

  const value = {
    markets,
    isLoading,
    selectedMarket,
    selectedCoin,
    changeMarket,
    selectCoin
  };

  return (
    <MarketContext.Provider value={value}>
      {children}
    </MarketContext.Provider>
  );
};

// 커스텀 Hook
export const useMarket = () => {
  const context = useContext(MarketContext);
  if (context === undefined) {
    throw new Error('useMarket must be used within a MarketProvider');
  }
  return context;
};

export default MarketContext;
