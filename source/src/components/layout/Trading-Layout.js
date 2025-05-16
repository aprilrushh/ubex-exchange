// src/components/layout/TradingLayout.js  16-05-2025 12:08am
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/TradingLayout.css';

const TradingLayout = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`trading-layout ${theme}`}>
      <header className="header">
        <div className="header-content">
          <div className="left-section">
            <Link to="/" className="logo">
              USDB Exchange
            </Link>
            <nav className="main-nav">
              <ul className="nav-list">
                <li className="nav-item">
                  <Link to="/">거래소</Link>
                </li>
                <li className="nav-item">
                  <Link to="/investments/balance">자산</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="right-section">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>
      
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default TradingLayout;
