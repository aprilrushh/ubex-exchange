#!/bin/bash

# 필요한 디렉토리 확인 및 생성
mkdir -p ./src/components/Chart/Indicators
mkdir -p ./src/context
mkdir -p ./src/styles

# 누락된 CSS 파일 생성
echo "/* App.css - 앱 전체 스타일 */" > ./src/styles/App.css
echo "/* SimpleChart.css - 차트 스타일 */" > ./src/components/Chart/SimpleChart.css
echo "/* TimeframeSelector.css - 시간 선택기 스타일 */" > ./src/components/Chart/TimeframeSelector.css

# 누락된 페이지 컴포넌트 생성
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

# App.js에서 useHistory -> useNavigate로 교체
sed -i '' 's/useHistory/useNavigate/g' ./src/pages/TradingPage.js

echo "누락된 파일 생성 및 Router 호환성 문제 해결 완료"
