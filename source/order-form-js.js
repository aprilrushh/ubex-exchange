import React, { useState, useContext, useEffect } from 'react';
import { OrderContext } from '../../context/OrderContext';
import { MarketContext } from '../../context/MarketContext';
import { AuthContext } from '../../context/AuthContext';
import './OrderForm.css';

const OrderForm = ({ symbol, currentPrice }) => {
  const { addOrder } = useContext(OrderContext);
  const { getBalance } = useContext(MarketContext);
  const { isAuthenticated } = useContext(AuthContext);
  
  // 거래 유형 (매수/매도)
  const [orderType, setOrderType] = useState('buy');
  
  // 주문 유형 (지정가/시장가)
  const [priceType, setPriceType] = useState('limit');
  
  // 입력값
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState('');
  
  // 사용 가능한 잔액
  const [availableBalance, setAvailableBalance] = useState({
    krw: 0,
    coin: 0
  });
  
  // 퍼센트 버튼 (25%, 50%, 75%, 100%)
  const percentages = [25, 50, 75, 100];
  
  // 현재가 업데이트 시 지정가 자동 설정
  useEffect(() => {
    if (currentPrice && !price) {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice]);
  
  // 잔액 가져오기
  useEffect(() => {
    if (isAuthenticated) {
      const [coinSymbol] = symbol.split('/');
      const balances = getBalance();
      setAvailableBalance({
        krw: balances.krw || 0,
        coin: balances[coinSymbol.toLowerCase()] || 0
      });
    }
  }, [isAuthenticated, symbol, getBalance]);
  
  // 가격 또는 수량 변경 시 총액 계산
  useEffect(() => {
    if (price && amount) {
      const calculatedTotal = parseFloat(price) * parseFloat(amount);
      setTotal(calculatedTotal.toFixed(0));
    } else {
      setTotal('');
    }
  }, [price, amount]);
  
  // 총액 변경 시 수량 계산
  useEffect(() => {
    if (price && total && parseFloat(price) > 0) {
      const calculatedAmount = parseFloat(total) / parseFloat(price);
      setAmount(calculatedAmount.toFixed(8));
    }
  }, [total, price]);
  
  // 퍼센트 버튼 클릭 시 금액 자동 설정
  const handlePercentageClick = (percentage) => {
    if (!price || parseFloat(price) <= 0) return;
    
    let maxAmount;
    if (orderType === 'buy') {
      // 매수 시 KRW 기준으로 계산
      maxAmount = availableBalance.krw / parseFloat(price);
    } else {
      // 매도 시 코인 수량 기준으로 계산
      maxAmount = availableBalance.coin;
    }
    
    const newAmount = (maxAmount * (percentage / 100)).toFixed(8);
    setAmount(newAmount);
  };
  
  // 주문 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('로그인이 필요합니다.');
      return;
    }
    
    if (!price || !amount || parseFloat(amount) <= 0) {
      alert('가격과 수량을 정확히 입력하세요.');
      return;
    }
    
    const order = {
      type: orderType,
      priceType,
      symbol,
      price: parseFloat(price),
      amount: parseFloat(amount),
      total: parseFloat(total),
      timestamp: new Date().getTime()
    };
    
    addOrder(order);
    
    // 주문 후 입력값 초기화 (지정가는 유지)
    if (priceType === 'market') {
      setPrice('');
    }
    setAmount('');
    setTotal('');
  };
  
  // 가격 입력 포맷팅
  const formatPrice = (value) => {
    if (!value) return '';
    return value.replace(/[^0-9]/g, '');
  };
  
  return (
    <div className="order-form">
      <div className="order-type-tabs">
        <button 
          className={`tab-button ${orderType === 'buy' ? 'buy active' : ''}`}
          onClick={() => setOrderType('buy')}
        >
          매수
        </button>
        <button 
          className={`tab-button ${orderType === 'sell' ? 'sell active' : ''}`}
          onClick={() => setOrderType('sell')}
        >
          매도
        </button>
      </div>
      
      <div className="price-type-tabs">
        <button 
          className={`price-type-button ${priceType === 'limit' ? 'active' : ''}`}
          onClick={() => setPriceType('limit')}
        >
          지정가
        </button>
        <button 
          className={`price-type-button ${priceType === 'market' ? 'active' : ''}`}
          onClick={() => setPriceType('market')}
        >
          시장가
        </button>
      </div>
      
      <div className="balance-info">
        <div className="balance-label">
          주문가능
        </div>
        <div className="balance-value">
          {orderType === 'buy' 
            ? `${availableBalance.krw.toLocaleString()} KRW` 
            : `${availableBalance.coin.toLocaleString()} ${symbol.split('/')[0]}`
          }
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {priceType === 'limit' && (
          <div className="form-group">
            <label htmlFor="price">주문가격</label>
            <div className="input-with-addon">
              <input
                type="text"
                id="price"
                value={formatPrice(price)}
                onChange={(e) => setPrice(formatPrice(e.target.value))}
                placeholder="0"
              />
              <span className="addon">KRW</span>
            </div>
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="amount">주문수량</label>
          <div className="input-with-addon">
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="0"
            />
            <span className="addon">{symbol.split('/')[0]}</span>
          </div>
        </div>
        
        <div className="percentage-buttons">
          {percentages.map((percent) => (
            <button
              key={percent}
              type="button"
              className="percent-button"
              onClick={() => handlePercentageClick(percent)}
            >
              {percent}%
            </button>
          ))}
        </div>
        
        {priceType === 'limit' && (
          <div className="form-group">
            <label htmlFor="total">주문총액</label>
            <div className="input-with-addon">
              <input
                type="text"
                id="total"
                value={total}
                onChange={(e) => setTotal(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0"
              />
              <span className="addon">KRW</span>
            </div>
          </div>
        )}
        
        <button 
          type="submit" 
          className={`order-submit-button ${orderType === 'buy' ? 'buy' : 'sell'}`}
          disabled={!isAuthenticated}
        >
          {orderType === 'buy' ? '매수' : '매도'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
