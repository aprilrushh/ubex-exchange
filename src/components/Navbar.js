import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          USDB Exchange
        </Link>

        <div className="nav-menu">
          <Link to="/" className="nav-item">
            홈
          </Link>
          <Link to="/exchange" className="nav-item">
            거래소
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/wallet" className="nav-item">
                지갑
              </Link>
              <Link to="/investments/balance" className="nav-item">
                투자현황
              </Link>
              <div className="nav-item user-menu">
                <span>{user?.name || '사용자'}</span>
                <button onClick={handleLogout} className="logout-button">
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">
                로그인
              </Link>
              <Link to="/register" className="nav-item">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 