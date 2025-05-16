#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}USDB Exchange 앱 오류 해결 스크립트 시작...${NC}"

# 필요한 디렉토리 확인 및 생성
echo -e "${YELLOW}필요한 디렉토리 생성 중...${NC}"
mkdir -p ./src/components/Chart/Indicators
mkdir -p ./src/context
mkdir -p ./src/styles

# 누락된 CSS 파일 생성
echo -e "${YELLOW}누락된 CSS 파일 생성 중...${NC}"
cat > ./src/styles/App.css << 'EOL'
/* App.css - 앱 전체 스타일 */

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 로딩 인디케이터 */
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1000;
}

.loading-spinner-dark {
  background-color: rgba(30, 34, 51, 0.7);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-blue);
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 알림 메시지 스타일 */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1100;
  animation: slideIn 0.3s ease-out;
  max-width: 300px;
}

.notification-success {
  border-left: 4px solid #4caf50;
}

.notification-error {
  border-left: 4px solid #f44336;
}

.notification-warning {
  border-left: 4px solid #ff9800;
}

.notification-info {
  border-left: 4px solid var(--primary-blue);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 버튼 스타일 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: var(--primary-blue);
  color: white;
}

.btn-primary:hover {
  background-color: var(--primary-blue-dark);
}

.btn-secondary {
  background-color: var(--panel);
  color: var(--primary-text);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background-color: var(--button-hover);
}

.btn-danger {
  background-color: var(--red-price);
  color: white;
}

.btn-danger:hover {
  background-color: #d6384b;
}

.btn-success {
  background-color: var(--green-price);
  color: white;
}

.btn-success:hover {
  background-color: #0055c4;
}

.btn-sm {
  padding: 4px 12px;
  font-size: 13px;
}

.btn-lg {
  padding: 10px 20px;
  font-size: 16px;
}

/* 폼 요소 스타일 */
.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: var(--secondary-text);
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid var(--border);
  background-color: var(--input-background);
  color: var(--primary-text);
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: var(--primary-blue);
}

.form-error {
  color: var(--red-price);
  font-size: 13px;
  margin-top: 4px;
}

/* 가격 표시 관련 스타일 */
.price-up {
  color: var(--red-price);
}

.price-down {
  color: var(--green-price);
}

.price-neutral {
  color: var(--primary-text);
}

/* 반응형 설정 */
@media (max-width: 1200px) {
  .container {
    max-width: 100%;
    padding: 0 16px;
  }
}

@media (max-width: 768px) {
  .hidden-mobile {
    display: none;
  }
}
EOL

cat > ./src/components/Chart/SimpleChart.css << 'EOL'
/* SimpleChart.css - 차트 스타일 */

.chart-container {
  position: relative;
  width: 100%;
  height: 400px;
  background-color: var(--background);
  border: 1px solid var(--border);
  border-radius: 4px;
}

.chart-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(var(--background-rgb), 0.8);
  z-index: 5;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: var(--primary-blue);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chart-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--background);
  z-index: 5;
}

.retry-button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: var(--primary-blue);
  color: white;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background-color: var(--primary-blue-dark);
}

.chart-toolbar {
  display: flex;
  padding: 8px 12px;
  background-color: var(--panel);
  border-bottom: 1px solid var(--border);
}

.chart-toolbar-button {
  padding: 6px 12px;
  margin-right: 8px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--secondary-text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.chart-toolbar-button:hover {
  background-color: var(--button-hover);
}

.chart-toolbar-button.active {
  background-color: var(--primary-blue);
  border-color: var(--primary-blue);
  color: white;
}

/* 레이아웃 조정을 위한 미디어 쿼리 */
@media (max-width: 768px) {
  .chart-container {
    height: 300px;
  }
  
  .chart-toolbar {
    overflow-x: auto;
    padding: 6px 10px;
  }
  
  .chart-toolbar-button {
    padding: 4px 8px;
    font-size: 12px;
  }
}
EOL

cat > ./src/components/Chart/TimeframeSelector.css << 'EOL'
/* TimeframeSelector.css - 시간 선택기 스타일 */

.timeframe-selector {
  display: flex;
  background-color: var(--panel);
  padding: 10px;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
  white-space: nowrap;
}

.timeframe-button {
  padding: 6px 12px;
  margin-right: 8px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 3px;
  color: var(--secondary-text);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.timeframe-button:last-child {
  margin-right: 0;
}

.timeframe-button:hover {
  background-color: var(--button-hover);
}

.timeframe-button.active {
  background-color: var(--primary-blue);
  border-color: var(--primary-blue);
  color: white;
}

/* 미디어 쿼리 */
@media (max-width: 576px) {
  .timeframe-selector {
    padding: 8px;
  }
  
  .timeframe-button {
    padding: 4px 8px;
    font-size: 12px;
    margin-right: 5px;
  }
}
EOL

# 누락된 페이지 컴포넌트 생성
echo -e "${YELLOW}누락된 페이지 컴포넌트 생성 중...${NC}"
cat > ./src/pages/BalancePage.js << 'EOL'
import React from 'react';

const BalancePage = () => {
  return (
    <div className="balance-page">
      <h2>보유자산</h2>
      <div className="balance-content">
        <p>아직 거래 내역이 없습니다.</p>
      </div>
    </div>
  );
};

export default BalancePage;
EOL

cat > ./src/pages/InvestPage.js << 'EOL'
import React from 'react';

const InvestPage = () => {
  return (
    <div className="invest-page">
      <h2>투자내역</h2>
      <div className="invest-content">
        <p>아직 투자 내역이 없습니다.</p>
      </div>
    </div>
  );
};

export default InvestPage;
EOL

cat > ./src/pages/DepositPage.js << 'EOL'
import React from 'react';

const DepositPage = () => {
  return (
    <div className="deposit-page">
      <h2>입금</h2>
      <div className="deposit-content">
        <p>입금 기능은 현재 준비중입니다.</p>
      </div>
    </div>
  );
};

export default DepositPage;
EOL

cat > ./src/pages/WithdrawPage.js << 'EOL'
import React from 'react';

const WithdrawPage = () => {
  return (
    <div className="withdraw-page">
      <h2>출금</h2>
      <div className="withdraw-content">
        <p>출금 기능은 현재 준비중입니다.</p>
      </div>
    </div>
  );
};

export default WithdrawPage;
EOL

# CryptoDataContext 생성
echo -e "${YELLOW}CryptoDataContext 생성 중...${NC}"
cat > ./src/context/CryptoDataContext.js << 'EOL'
import React, { createContext, useState, useContext } from 'react';

// 가상화폐 데이터 컨텍스트 생성
export const CryptoDataContext = createContext();

// 컨텍스트 훅
export const useCryptoData = () => useContext(CryptoDataContext);

export const CryptoDataProvider = ({ children }) => {
  // 코인 데이터 상태
  const [cryptoData, setCryptoData] = useState({});
  
  // 차트 데이터 가져오기 (더미 데이터 생성)
  const getCandleData = async (symbol, timeframe) => {
    // 실제 API 호출 대신 더미 데이터 생성
    return generateDummyData(timeframe);
  };
  
  // 실시간 가격 가져오기 (더미 데이터)
  const getRealtimePrice = async (symbol) => {
    // 더미 데이터 반환
    return {
      price: 144313000,
      change: -651000,
      changePercent: -0.45
    };
  };
  
  // 더미 데이터 생성 함수
  const generateDummyData = (range) => {
    const now = new Date();
    const data = [];
    const intervals = range === '1d' ? 24 : 30;
    
    let basePrice = 144000000;
    let prevClose = basePrice;
    
    for (let i = 0; i < intervals; i++) {
      const time = new Date(now);
      
      if (range === '30m') time.setMinutes(time.getMinutes() - (intervals - i) * 30);
      else if (range === '1h') time.setHours(time.getHours() - (intervals - i));
      else if (range === '4h') time.setHours(time.getHours() - (intervals - i) * 4);
      else if (range === '1d') time.setDate(time.getDate() - (intervals - i));
      else if (range === '1w') time.setDate(time.getDate() - (intervals - i) * 7);
      else if (range === '1M') time.setMonth(time.getMonth() - (intervals - i));
      
      const variance = Math.random() * 0.03 - 0.015; // -1.5% to +1.5%
      const change = prevClose * variance;
      
      const open = prevClose;
      const close = Math.round(open + change);
      const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.01));
      const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.01));
      const volume = Math.round(Math.random() * 50000000 + 50000000);
      
      data.push({
        time: time.toISOString(),
        timeLabel: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateLabel: time.toLocaleDateString(),
        open,
        high,
        low,
        close,
        volume,
        ma5: Math.round(basePrice * (1 + (Math.sin(i * 0.2) * 0.02))),
        ma20: Math.round(basePrice * (1 + (Math.cos(i * 0.1) * 0.01)))
      });
      
      prevClose = close;
    }
    
    return data;
  };

  return (
    <CryptoDataContext.Provider
      value={{
        cryptoData,
        setCryptoData,
        getCandleData,
        getRealtimePrice
      }}
    >
      {children}
    </CryptoDataContext.Provider>
  );
};
EOL

# IndicatorSelector 컴포넌트 생성
echo -e "${YELLOW}IndicatorSelector 컴포넌트 생성 중...${NC}"
cat > ./src/components/Chart/Indicators/IndicatorSelector.js << 'EOL'
import React, { useState } from 'react';
import './IndicatorSelector.css';

const INDICATORS = [
  { id: 'ma', label: '이동평균선', params: ['5', '10', '20', '50', '120'] },
  { id: 'bb', label: '볼린저밴드', params: ['20,2', '20,3'] },
  { id: 'macd', label: 'MACD', params: ['12,26,9'] },
  { id: 'rsi', label: 'RSI', params: ['14', '21'] },
  { id: 'sto', label: '스토캐스틱', params: ['9,3,3', '14,3,3'] }
];

const IndicatorSelector = ({ onSelect }) => {
  const [activeIndicator, setActiveIndicator] = useState(null);

  const handleIndicatorClick = (indicator) => {
    setActiveIndicator(indicator.id === activeIndicator ? null : indicator.id);
  };

  const handleParamClick = (indicatorId, param) => {
    if (onSelect) {
      onSelect(indicatorId, param);
    }
    setActiveIndicator(null);
  };

  return (
    <div className="indicator-selector">
      {INDICATORS.map((indicator) => (
        <div key={indicator.id} className="indicator-item">
          <button
            className={`indicator-button ${activeIndicator === indicator.id ? 'active' : ''}`}
            onClick={() => handleIndicatorClick(indicator)}
          >
            {indicator.label}
          </button>
          
          {activeIndicator === indicator.id && (
            <div className="param-dropdown">
              {indicator.params.map((param) => (
                <button
                  key={param}
                  className="param-button"
                  onClick={() => handleParamClick(indicator.id, param)}
                >
                  {indicator.label} ({param})
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default IndicatorSelector;
EOL

# IndicatorSelector CSS 생성
cat > ./src/components/Chart/Indicators/IndicatorSelector.css << 'EOL'
.indicator-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.indicator-item {
  position: relative;
}

.indicator-button {
  padding: 6px 12px;
  background: var(--panel, #f9fafc);
  border: 1px solid var(--border, #e9ecef);
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.indicator-button:hover {
  background: var(--button-hover, #f1f3f5);
}

.indicator-button.active {
  background: var(--primary-blue, #1261c4);
  color: white;
}

.param-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  min-width: 150px;
  margin-top: 5px;
  background: var(--background, white);
  border: 1px solid var(--border, #e9ecef);
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.param-button {
  display: block;
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid var(--border, #e9ecef);
  font-size: 13px;
  cursor: pointer;
}

.param-button:last-child {
  border-bottom: none;
}

.param-button:hover {
  background: var(--button-hover, #f1f3f5);
}
EOL

# i18n.js 파일 생성
echo -e "${YELLOW}i18n.js 파일 생성 중...${NC}"
cat > ./src/i18n.js << 'EOL'
// i18n.js - 다국어 설정
const i18n = {
  // 다국어 설정 (간단 버전)
  translations: {
    ko: {
      common: {
        search: '검색',
        cancel: '취소',
        confirm: '확인',
        save: '저장'
      },
      trading: {
        buy: '매수',
        sell: '매도',
        price: '가격',
        amount: '수량',
        total: '총액',
        orderBook: '호가',
        trades: '체결',
        chart: '차트'
      }
    },
    en: {
      common: {
        search: 'Search',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save'
      },
      trading: {
        buy: 'Buy',
        sell: 'Sell',
        price: 'Price',
        amount: 'Amount',
        total: 'Total',
        orderBook: 'Order Book',
        trades: 'Trades',
        chart: 'Chart'
      }
    }
  },
  
  // 현재 언어
  currentLanguage: 'ko',
  
  // 번역 함수
  t(key) {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key;
      }
    }
    
    return translation;
  },
  
  // 언어 변경
  changeLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
    }
  }
};

export default i18n;
EOL

# TradingPage.js 수정 (useHistory -> useNavigate)
echo -e "${YELLOW}TradingPage.js 파일 수정 중...${NC}"

# 백업 생성
if [ -f "./src/pages/TradingPage.js" ]; then
  cp ./src/pages/TradingPage.js ./src/pages/TradingPage.js.bak
fi

# TradingPage.js 생성/수정
cat > ./src/pages/TradingPage.js << 'EOL'
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useHistory -> useNavigate로 변경
import TradingLayout from '../components/layout/TradingLayout';
import SimpleChart from '../components/Chart/SimpleChart';
import TimeframeSelector from '../components/Chart/TimeframeSelector';
import OrderBook from '../components/OrderBook/OrderBook';
import TradeHistory from '../components/TradeHistory/TradeHistory';
import OrderForm from '../components/OrderForm/OrderForm';
import PriceInfoPanel from '../components/Chart/PriceInfoPanel';
import { MarketContext } from '../context/MarketContext';
import { OrderContext } from '../context/OrderContext';
import { ThemeContext } from '../context/ThemeContext';
import './TradingPage.css';

const TradingPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate(); // useHistory -> useNavigate로 변경
  const { coinList } = useContext(MarketContext);
  const { orders } = useContext(OrderContext);
  const { theme } = useContext(ThemeContext);
  
  // 상태 관리
  const [currentSymbol, setCurrentSymbol] = useState(symbol || 'BTC/KRW');
  const [timeframe, setTimeframe] = useState('1D');
  const [currentPrice, setCurrentPrice] = useState(144313000);
  const [priceChange, setPriceChange] = useState({
    value: -651000,
    percentage: -0.45
  });
  
  // 기본 가격 데이터
  const priceData = {
    high24h: 145186000,
    low24h: 144037000,
    volume24h: 194600583627,
    volumeBase24h: 1346.789
  };
  
  // URL 파라미터에서 심볼 변경 감지
  useEffect(() => {
    if (symbol) {
      setCurrentSymbol(symbol);
    }
  }, [symbol]);
  
  // 코인 목록이 로드되면 기본 코인 설정
  useEffect(() => {
    if (coinList && coinList.length > 0 && !symbol) {
      // 기본 코인(BTC/KRW) URL로 리다이렉트
      navigate('/trading/BTC/KRW');
    }
  }, [coinList, symbol, navigate]);
  
  // 시간 프레임 변경 핸들러
  const handleTimeframeChange = (tf) => {
    setTimeframe(tf);
  };
  
  return (
    <div className={`trading-page ${theme}`}>
      <PriceInfoPanel 
        symbol={currentSymbol}
        currentPrice={currentPrice}
        priceChange={priceChange}
        high24h={priceData.high24h}
        low24h={priceData.low24h}
        volume24h={priceData.volume24h}
        volumeBase24h={priceData.volumeBase24h}
      />
      
      <div className="trading-content">
        <div className="chart-section">
          <TimeframeSelector 
            activeTimeframe={timeframe} 
            onTimeframeChange={handleTimeframeChange} 
          />
          <SimpleChart 
            symbol={currentSymbol} 
            timeframe={timeframe}
          />
        </div>
        
        <div className="order-section">
          <div className="order-book-container">
            <OrderBook 
              symbol={currentSymbol} 
              currentPrice={currentPrice}
            />
          </div>
          
          <div className="order-form-container">
            <OrderForm 
              symbol={currentSymbol} 
              currentPrice={currentPrice}
            />
          </div>
          
          <div className="trade-history-container">
            <TradeHistory symbol={currentSymbol} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPage;
EOL

echo -e "${GREEN}오류 해결 작업 완료!${NC}"
echo "이제 'npm start' 명령어로 애플리케이션을 실행해보세요."
