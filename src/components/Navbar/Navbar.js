import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${theme}`}>
      <div className="navbar-left">
        <Link to="/" className="logo">
          USDB Exchange
        </Link>
      </div>

      <div className="navbar-center">
        <Link to="/market" className="nav-item">
          Market
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/deposit" className="nav-item">
              입금
            </Link>
            <Link to="/withdraw" className="nav-item">
              출금
            </Link>
            <Link to="/investments/balance" className="nav-item">
              투자내역
            </Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        {isAuthenticated ? (
          <button className="auth-button" onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <Link to="/login" className="auth-button">
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 