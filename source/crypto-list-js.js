import React, { useContext } from 'react';
import { MarketContext } from '../../context/MarketContext';
import './CryptoList.css';

const CryptoList = ({ 
  market, 
  sortBy, 
  sortOrder, 
  searchQuery, 
  onCoinSelect,
  activeCoin 
}) => {
  const { coinList, toggleFavorite } = useContext(MarketContext);
  
  // 필터링 및 정렬 함수
  const getFilteredAndSortedCoins = () => {
    // 마켓에 따른 필터링
    let filtered = coinList.filter(coin => {
      if (market === '원화') return coin.market === 'KRW';
      if (market === 'BTC') return coin.market === 'BTC';
      if (market === 'USDT') return coin.market === 'USDT';
      if (market === '보유') return coin.balance > 0;
      if (market === '관심') return coin.isFavorite;
      return true;
    });
    
    // 검색어 필터링
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(coin => 
        coin.symbol.toLowerCase().includes(query) || 
        coin.koreanName.toLowerCase().includes(query) ||
        coin.englishName.toLowerCase().includes(query)
      );
    }
    
    // 정렬
    return filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case '한글명':
          compareValue = a.koreanName.localeCompare(b.koreanName, 'ko');
          break;
        case '현재가':
          compareValue = a.price - b.price;
          break;
        case '전일대비':
          compareValue = a.changePercent24h - b.changePercent24h;
          break;
        case '거래대금':
          compareValue = a.volume24hKRW - b.volume24hKRW;
          break;
        default:
          compareValue = 0;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
  };
  
  const handleCoinClick = (coin) => {
    if (onCoinSelect) {
      onCoinSelect(`${coin.symbol}/${coin.market}`);
    }
  };
  
  const handleFavoriteToggle = (e, coinId) => {
    e.stopPropagation();
    toggleFavorite(coinId);
  };
  
  // 가격 변동률에 따른 클래스 이름
  const getPriceChangeClass = (change) => {
    if (!change && change !== 0) return '';
    return change >= 0 ? 'price-up' : 'price-down';
  };
  
  // 포맷 함수
  const formatNumber = (num, decimals = 0) => {
    if (!num && num !== 0) return '--';
    return parseFloat(num).toLocaleString('ko-KR', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };
  
  // 가격 표시 포맷 (마켓에 따라 다르게 표시)
  const formatPrice = (price, market) => {
    if (market === 'KRW') return formatNumber(price);
    if (market === 'BTC') return price.toFixed(8);
    if (market === 'USDT') return price.toFixed(4);
    return formatNumber(price);
  };
  
  const filteredCoins = getFilteredAndSortedCoins();
  
  // 예시 코인 데이터 (실제 구현에서는 MarketContext에서 가져온 데이터 사용)
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
  
  // 표시할 코인 데이터 (실제 또는 예시)
  const coinsToShow = filteredCoins.length > 0 ? filteredCoins : exampleCoins;
  
  return (
    <div className="crypto-list">
      {coinsToShow.map(coin => {
        const isActive = activeCoin === `${coin.symbol}/${coin.market}`;
        return (
          <div 
            key={coin.id} 
            className={`coin-item ${isActive ? 'active' : ''}`}
            onClick={() => handleCoinClick(coin)}
          >
            <div className="coin-item-favorite">
              <button 
                className={`favorite-button ${coin.isFavorite ? 'active' : ''}`}
                onClick={(e) => handleFavoriteToggle(e, coin.id)}
                aria-label={coin.isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
              >
                {coin.isFavorite ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffca28" stroke="#ffca28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                )}
              </button>
            </div>
            
            <div className="coin-info">
              <div className="coin-name-wrapper">
                <span className="coin-name">{coin.koreanName}</span>
                <span className="coin-market">{coin.market}</span>
              </div>
              <div className="coin-symbol">{coin.symbol}/{coin.market}</div>
            </div>
            
            <div className="coin-price-info">
              <div className="coin-price">
                {formatPrice(coin.price, coin.market)}
              </div>
              <div className={`coin-change ${getPriceChangeClass(coin.changePercent24h)}`}>
                {coin.changePercent24h >= 0 ? '+' : ''}
                {coin.changePercent24h.toFixed(2)}%
              </div>
            </div>
            
            <div className="coin-volume">
              {formatNumber(coin.volume24hKRW / 1000000)}백만
            </div>
          </div>
        );
      })}
      
      {coinsToShow.length === 0 && (
        <div className="empty-list">
          <p>검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default CryptoList;
