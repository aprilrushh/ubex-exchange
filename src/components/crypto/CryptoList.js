import React from 'react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import './CryptoList.css';

const CryptoList = ({ 
  market, 
  sortBy, 
  sortOrder, 
  searchQuery, 
  onCoinSelect,
  activeCoin 
}) => {
  const { marketData } = useMarket();
  const { user } = useAuth();
  
  // 코인 데이터 필터링 및 정렬
  const filteredCoins = React.useMemo(() => {
    if (!marketData) return [];

    let filtered = marketData.filter(coin => {
      if (!coin) return false;
      
      // 검색어 필터링
      const matchesSearch = searchQuery === '' || 
        (coin.name && coin.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (coin.symbol && coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()));

      // 마켓 필터링
      const matchesMarket = market === '원화' ? coin.symbol?.endsWith('/KRW') :
        market === 'BTC' ? coin.symbol?.endsWith('/BTC') :
        market === 'USDT' ? coin.symbol?.endsWith('/USDT') :
        market === '보유' ? (user?.balances?.[coin.symbol] || 0) > 0 :
        market === '관심' ? user?.favorites?.includes(coin.symbol) :
        true;

      return matchesSearch && matchesMarket;
    });

    // 정렬
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      let comparison = 0;
      switch (sortBy) {
        case '한글명':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case '현재가':
          comparison = (a.price || 0) - (b.price || 0);
          break;
        case '전일대비':
          comparison = (a.change || 0) - (b.change || 0);
          break;
        case '거래대금':
          comparison = (a.volume || 0) - (b.volume || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [marketData, market, sortBy, sortOrder, searchQuery, user]);
  
  const handleCoinClick = (coin) => {
    if (onCoinSelect && coin?.symbol) {
      onCoinSelect(coin.symbol);
    }
  };
  
  const handleFavoriteToggle = (e, coinId) => {
    e.stopPropagation();
    // Implement favorite toggle logic
  };
  
  // 가격 변동률에 따른 클래스 이름
  const getPriceChangeClass = (change) => {
    if (change === undefined || change === null) return '';
    return change >= 0 ? 'price-up' : 'price-down';
  };
  
  // 포맷 함수
  const formatNumber = (num, decimals = 0) => {
    if (num === undefined || num === null) return '--';
    return parseFloat(num).toLocaleString('ko-KR', { 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };
  
  // 가격 표시 포맷 (마켓에 따라 다르게 표시)
  const formatPrice = (price, market) => {
    if (price === undefined || price === null) return '--';
    if (market === 'KRW') return formatNumber(price);
    if (market === 'BTC') return price.toFixed(8);
    if (market === 'USDT') return price.toFixed(4);
    return formatNumber(price);
  };
  
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
        if (!coin) return null;
        
        const isActive = activeCoin === coin.symbol;
        return (
          <div 
            key={coin.symbol} 
            className={`coin-item ${isActive ? 'active' : ''}`}
            onClick={() => handleCoinClick(coin)}
          >
            <div className="coin-item-favorite">
              <button 
                className={`favorite-button ${coin.isFavorite ? 'active' : ''}`}
                onClick={(e) => handleFavoriteToggle(e, coin.symbol)}
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
                <span className="coin-name">{coin.name || 'Unknown'}</span>
                <span className="coin-market">{coin.market || 'KRW'}</span>
              </div>
              <div className="coin-symbol">{coin.symbol || 'Unknown'}</div>
            </div>
            
            <div className="coin-price-info">
              <div className="coin-price">
                {formatPrice(coin.price, coin.market)}
              </div>
              <div className={`coin-change ${getPriceChangeClass(coin.change)}`}>
                {coin.change !== undefined && coin.change !== null && (
                  <>
                    {coin.change >= 0 ? '+' : ''}
                    {coin.change.toFixed(2)}%
                  </>
                )}
              </div>
            </div>
            
            <div className="coin-volume">
              {formatNumber((coin.volume || 0) / 1000000)}백만
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
