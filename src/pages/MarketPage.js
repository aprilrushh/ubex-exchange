import React, { useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import './MarketPage.css';

const MarketPage = () => {
  const { marketData, fetchMarketData } = useMarket();

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // marketData가 배열이 아닐 경우 빈 배열 사용
  const displayData = Array.isArray(marketData) ? marketData : [];

  return (
    <div className="market-page">
      <h2>거래 가능한 코인</h2>
      <div className="market-grid">
        {displayData.map((coin) => (
          <div key={coin.symbol} className="market-card">
            <div className="coin-info">
              <h3>{coin.name}</h3>
              <p className="symbol">{coin.symbol}</p>
            </div>
            <div className="price-info">
              <p className="price">₩{coin.price.toLocaleString()}</p>
              <p className={`change ${coin.change >= 0 ? 'positive' : 'negative'}`}>
                {coin.change >= 0 ? '+' : ''}{coin.change}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPage; 