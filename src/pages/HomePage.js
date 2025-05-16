import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>USDB Exchange</h1>
          <p>안전하고 신뢰할 수 있는 암호화폐 거래소</p>
          {!isAuthenticated && (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                회원가입
              </Link>
              <Link to="/login" className="btn btn-secondary">
                로그인
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <h2>주요 기능</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>실시간 거래</h3>
            <p>실시간 시세와 거래 정보를 제공합니다.</p>
          </div>
          <div className="feature-card">
            <h3>안전한 지갑</h3>
            <p>최고 수준의 보안으로 자산을 안전하게 보관합니다.</p>
          </div>
          <div className="feature-card">
            <h3>투자 현황</h3>
            <p>상세한 투자 현황과 수익률을 확인할 수 있습니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 