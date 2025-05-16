import React, { useState, useContext } from 'react';
import { OrderContext } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import './OrderForm.css';

const OrderForm = ({ symbol, currentPrice }) => {
  const { addOrder } = useContext(OrderContext);
  const { user } = useAuth();
  const [orderType, setOrderType] = useState('buy');
  const [price, setPrice] = useState(currentPrice);
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);

  // 가격 변경 핸들러
  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    setPrice(newPrice);
    calculateTotal(newPrice, amount);
  };

  // 수량 변경 핸들러
  const handleAmountChange = (e) => {
    const newAmount = parseFloat(e.target.value);
    setAmount(newAmount);
    calculateTotal(price, newAmount);
  };

  // 총액 계산
  const calculateTotal = (price, amount) => {
    const calculatedTotal = price * amount;
    setTotal(isNaN(calculatedTotal) ? 0 : calculatedTotal);
  };

  // 주문 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!amount || amount <= 0) {
      alert('유효한 수량을 입력해주세요.');
      return;
    }

    if (!price || price <= 0) {
      alert('유효한 가격을 입력해주세요.');
      return;
    }

    const order = {
      symbol,
      type: orderType,
      price,
      amount,
      total,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    addOrder(order);
    
    // 폼 초기화
    setAmount('');
    setTotal(0);
  };

  return (
    <div className="order-form">
      <div className="order-type-tabs">
        <button
          className={`order-type-tab ${orderType === 'buy' ? 'active' : ''}`}
          onClick={() => setOrderType('buy')}
        >
          매수
        </button>
        <button
          className={`order-type-tab ${orderType === 'sell' ? 'active' : ''}`}
          onClick={() => setOrderType('sell')}
        >
          매도
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>가격 (KRW)</label>
          <input
            type="number"
            value={price}
            onChange={handlePriceChange}
            placeholder="가격을 입력하세요"
          />
        </div>

        <div className="form-group">
          <label>수량</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="수량을 입력하세요"
            step="0.00000001"
          />
        </div>

        <div className="form-group">
          <label>총액 (KRW)</label>
          <div className="total-amount">
            {total.toLocaleString()} KRW
          </div>
        </div>

        <button
          type="submit"
          className={`submit-button ${orderType}`}
        >
          {orderType === 'buy' ? '매수하기' : '매도하기'}
        </button>
      </form>

      {user && (
        <div className="balance-info">
          <div className="balance-item">
            <span>보유 KRW</span>
            <span>{user.balances?.KRW?.toLocaleString() || 0} KRW</span>
          </div>
          <div className="balance-item">
            <span>보유 {symbol.split('/')[0]}</span>
            <span>{user.balances?.[symbol.split('/')[0]]?.toFixed(8) || 0}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
