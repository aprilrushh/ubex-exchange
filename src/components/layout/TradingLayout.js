import React, { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import CryptoList from '../crypto/CryptoList';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './TradingLayout.css';

const TradingLayout = () => {
  const { theme } = useContext(ThemeContext);
  const [activeMarket, setActiveMarket] = useState('원화');
  const [sortBy, setSortBy] = useState('한글명');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 코인 정렬 핸들러
  const handleSort = (sortKey) => {
    if (sortBy === sortKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortKey);
      setSortOrder('asc');
    }
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // 코인 선택 핸들러
  const handleCoinSelect = (symbol) => {
    navigate(`/trading/${symbol}`);
  };

  return (
    <div className={`trading-layout ${theme}`}>
      <Header />
      
      <div className="main-content">
        {/* 메인 콘텐츠 영역 */}
        <div className="content-area">
          <Outlet />
        </div>
        
        {/* 우측 사이드바 - 코인 목록 */}
        <div className="right-sidebar">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="코인명/심볼검색" 
              className="coin-search-input" 
              value={searchQuery}
              onChange={handleSearch}
            />
            <button className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
          
          <div className="market-tabs">
            <button 
              className={`market-tab ${activeMarket === '원화' ? 'active' : ''}`}
              onClick={() => setActiveMarket('원화')}
            >
              원화
            </button>
            <button 
              className={`market-tab ${activeMarket === 'BTC' ? 'active' : ''}`}
              onClick={() => setActiveMarket('BTC')}
            >
              BTC
            </button>
            <button 
              className={`market-tab ${activeMarket === 'USDT' ? 'active' : ''}`}
              onClick={() => setActiveMarket('USDT')}
            >
              USDT
            </button>
            <button 
              className={`market-tab ${activeMarket === '보유' ? 'active' : ''}`}
              onClick={() => setActiveMarket('보유')}
            >
              보유
            </button>
            <button 
              className={`market-tab ${activeMarket === '관심' ? 'active' : ''}`}
              onClick={() => setActiveMarket('관심')}
            >
              관심
            </button>
          </div>
          
          <div className="coin-list-header">
            <button 
              className={`sort-button ${sortBy === '한글명' ? 'active' : ''}`}
              onClick={() => handleSort('한글명')}
            >
              한글명 {sortBy === '한글명' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`sort-button ${sortBy === '현재가' ? 'active' : ''}`}
              onClick={() => handleSort('현재가')}
            >
              현재가 {sortBy === '현재가' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`sort-button ${sortBy === '전일대비' ? 'active' : ''}`}
              onClick={() => handleSort('전일대비')}
            >
              전일대비 {sortBy === '전일대비' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`sort-button ${sortBy === '거래대금' ? 'active' : ''}`}
              onClick={() => handleSort('거래대금')}
            >
              거래대금 {sortBy === '거래대금' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
          
          <CryptoList 
            market={activeMarket}
            sortBy={sortBy}
            sortOrder={sortOrder}
            searchQuery={searchQuery}
            onCoinSelect={handleCoinSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default TradingLayout;
