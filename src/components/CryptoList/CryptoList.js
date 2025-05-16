import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarket } from '../../context/MarketContext';
import './CryptoList.css';

const CryptoList = () => {
  const navigate = useNavigate();
  const { marketData } = useMarket();

  const handleCoinClick = (symbol) => {
    navigate(`/trading/${symbol}`);
  };

  return (
    <div className="crypto-list">
      <h2>거래 가능한 코인</h2>
      <div className="coin-grid">
        {marketData.map((coin) => (
          <div
            key={coin.symbol}
            className="coin-card"
            onClick={() => handleCoinClick(coin.symbol)}
          >
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

export default CryptoList; 