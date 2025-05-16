import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMarket } from '../context/MarketContext';
import { useAuth } from '../context/AuthContext';
import SimpleChart from '../components/chart/SimpleChart';
import OrderForm from '../components/order/OrderForm';
import TradeHistory from '../components/trade/TradeHistory';
import CryptoList from '../components/crypto/CryptoList';
import './TradingPage.css';

const TradingPage = () => {
  const { symbol = 'BTC/KRW' } = useParams();
  const navigate = useNavigate();
  const { marketData, fetchMarketData } = useMarket();
  const { user } = useAuth();
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [orderType, setOrderType] = useState('buy');
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    if (symbol) {
      fetchMarketData(symbol);
      const coin = marketData.find(c => c.symbol === symbol);
      if (coin) {
        setSelectedCoin(coin);
      }
    }
  }, [symbol, fetchMarketData, marketData]);

  useEffect(() => {
    if (!symbol) {
      navigate('/trading/BTC/KRW');
    }
  }, [symbol, navigate]);

  const handleCoinSelect = (coinSymbol) => {
    navigate(`/trading/${coinSymbol}`);
  };

  return (
    <div className="trading-page">
      <div className="trading-layout">
        <div className="trading-left">
          <div className="coin-list-container">
            <CryptoList
              onCoinSelect={handleCoinSelect}
              activeCoin={symbol}
            />
          </div>
        </div>
        
        <div className="trading-center">
          <div className="chart-container">
            <SimpleChart symbol={symbol} />
          </div>
          
          <div className="order-form-container">
            <OrderForm
              symbol={symbol}
              orderType={orderType}
              onOrderTypeChange={setOrderType}
            />
          </div>
        </div>
        
        <div className="trading-right">
          <div className="asset-info">
            <h3>보유자산</h3>
            <div className="asset-details">
              <div className="asset-item">
                <span>KRW</span>
                <span>{user?.balance?.krw?.toLocaleString() || 0}원</span>
              </div>
              {selectedCoin && (
                <div className="asset-item">
                  <span>{selectedCoin.symbol.split('/')[0]}</span>
                  <span>{user?.balance?.[selectedCoin.symbol.split('/')[0]] || 0}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="trade-history-container">
            <TradeHistory symbol={symbol} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPage;
