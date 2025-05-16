import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  
  const [time, setTime] = useState('02시 58분');
  const [menuDropdown, setMenuDropdown] = useState(false);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('KO');
  
  // 메뉴 활성화 상태 확인
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // 언어 변경
  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    setLanguageDropdown(false);
  };
  
  return (
    <header className={`header ${theme}`}>
      <div className="header-content">
        <div className="left-section">
          <Link to="/" className="logo">
            <img src="/images/logo.svg" alt="UBEx" className="logo-image" />
            <span className="logo-text">UBEx</span>
          </Link>
          
          <nav className="main-nav">
            <ul className="nav-list">
              <li className={`nav-item ${isActive('/exchange') ? 'active' : ''}`}>
                <Link to="/exchange">거래소</Link>
              </li>
              <li className={`nav-item ${isActive('/investments') ? 'active' : ''}`}>
                <Link to="/investments/balance">입출금</Link>
              </li>
              <li className={`nav-item ${isActive('/investments/area') ? 'active' : ''}`}>
                <Link to="/investments/area">투자내역</Link>
              </li>
              <li className={`nav-item ${isActive('/coinsinfo') ? 'active' : ''}`}>
                <Link to="/coinsinfo">코인동향</Link>
              </li>
              <li className={`nav-item dropdown-item ${isActive('/service') ? 'active' : ''}`}>
                <button 
                  className="dropdown-trigger"
                  onClick={() => setMenuDropdown(!menuDropdown)}
                >
                  서비스 <span className="dropdown-icon">+</span>
                </button>
                {menuDropdown && (
                  <div className="dropdown-menu">
                    <Link to="/service/staking" className="dropdown-link">스테이킹</Link>
                    <Link to="/service/lending" className="dropdown-link">랜딩</Link>
                    <Link to="/service/events" className="dropdown-link">이벤트</Link>
                    <Link to="/service/support" className="dropdown-link">고객지원</Link>
                  </div>
                )}
              </li>
              <li className={`nav-item ${isActive('/center') ? 'active' : ''}`}>
                <Link to="/center">고객센터</Link>
              </li>
              <li className={`nav-item ${isActive('/nft') ? 'active' : ''}`}>
                <Link to="/nft">NFT <span className="external-icon">↗</span></Link>
              </li>
              <li className={`nav-item ${isActive('/datalab') ? 'active' : ''}`}>
                <Link to="/datalab">데이터랩 <span className="external-icon">↗</span></Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="right-section">
          <div className="time-display">{time}</div>
          
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '다크모드' : '라이트모드'}
          </button>
          
          {isAuthenticated ? (
            <div className="user-menu">
              <button className="user-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
              <button className="apps-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-button">로그인</Link>
          )}
          
          <div className="language-selector">
            <button 
              className="language-button"
              onClick={() => setLanguageDropdown(!languageDropdown)}
            >
              <span className={`language-flag ${currentLanguage.toLowerCase()}`}></span>
              <span className="current-language">{currentLanguage}</span>
            </button>
            {languageDropdown && (
              <div className="language-dropdown">
                <button 
                  className={`language-option ${currentLanguage === 'EN' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('EN')}
                >
                  <span className="language-flag en"></span>
                  <span>English</span>
                </button>
                <button 
                  className={`language-option ${currentLanguage === 'KO' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('KO')}
                >
                  <span className="language-flag ko"></span>
                  <span>한국어</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
