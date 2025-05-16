import React from 'react';
import './PriceInfoPanel.css';

const PriceInfoPanel = ({ symbol, currentPrice, priceChange, high24h, low24h, volume24h, volumeBase24h }) => {
  // 시세 증감 판단
  const isPriceUp = priceChange && priceChange.percentage >= 0;
  const priceChangeClass = isPriceUp ? 'price-up' : 'price-down';
  
  // 가격 정보 포맷팅
  const formatPrice = (price) => {
    if (!price && price !== 0) return '--';
    return price.toLocaleString();
  };

  const formatChange = (change) => {
    if (!change && change !== 0) return '--';
    const prefix = change >= 0 ? '+' : '';
    return `${prefix}${change.toLocaleString()}`;
  };

  const formatPercentage = (percentage) => {
    if (!percentage && percentage !== 0) return '--';
    const prefix = percentage >= 0 ? '+' : '';
    return `${prefix}${percentage.toFixed(2)}%`;
  };

  // 심볼에서 코인명과 페어 분리
  const [coinName, pairCurrency] = symbol ? symbol.split('/') : ['BTC', 'KRW'];

  // 기본값 설정
  const high = high24h || 0;
  const low = low24h || 0;
  const volume = volume24h || 0;
  const volumeBase = volumeBase24h || 0;

  return (
    <div className="price-info-panel">
      <div className="symbol-info">
        <h2 className="coin-name">
          {coinName || 'BTC'}<span className="pair-currency">/{pairCurrency || 'KRW'}</span>
        </h2>
        
        <div className="market-info">
          <span className="market-label">USDB Ex</span>
          <span className="divider">|</span>
          <span className="market-pair">{symbol || 'BTC/KRW'}</span>
        </div>
      </div>
      
      <div className="price-section">
        <div className="current-price-container">
          <span className={`current-price ${priceChangeClass}`}>
            {formatPrice(currentPrice)}
            <span className="currency">KRW</span>
          </span>
          
          <div className={`price-change ${priceChangeClass}`}>
            <span className="change-value">
              {formatChange(priceChange?.value)}
            </span>
            <span className="change-percentage">
              {formatPercentage(priceChange?.percentage)}
            </span>
          </div>
        </div>
        
        <div className="price-details">
          <div className="detail-row">
            <span className="detail-label">고가(24h)</span>
            <span className="detail-value">{formatPrice(high)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">저가(24h)</span>
            <span className="detail-value">{formatPrice(low)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">거래대금(24h)</span>
            <span className="detail-value">{formatPrice(volume)} KRW</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">거래량(24h)</span>
            <span className="detail-value">{volumeBase.toLocaleString()} {coinName}</span>
          </div>
        </div>
      </div>
      
      <div className="external-price-references">
        <div className="exchange-reference">
          <span className="exchange-name">Coinbase</span>
          <span className="exchange-price">{(currentPrice * 0.998).toLocaleString()}</span>
          <span className="exchange-usd-price">(${(currentPrice / 1400).toFixed(2)})</span>
        </div>
        <div className="exchange-reference">
          <span className="exchange-name">Bitfinex</span>
          <span className="exchange-price">{(currentPrice * 1.002).toLocaleString()}</span>
          <span className="exchange-usd-price">(${(currentPrice / 1390).toFixed(2)})</span>
        </div>
        <div className="exchange-reference">
          <span className="exchange-name">Kraken</span>
          <span className="exchange-price">{(currentPrice * 1.003).toLocaleString()}</span>
          <span className="exchange-usd-price">(${(currentPrice / 1395).toFixed(2)})</span>
        </div>
      </div>
    </div>
  );
};

export default PriceInfoPanel;
