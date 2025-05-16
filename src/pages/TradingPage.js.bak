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
