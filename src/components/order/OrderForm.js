import React, { useState, useEffect } from 'react';
import { useMarket } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import './OrderForm.css';

const OrderForm = ({ symbol, orderType, onOrderTypeChange }) => {
  const { marketData } = useMarket();
  const { user } = useAuth();
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    const coin = marketData.find(c => c.symbol === symbol);
    if (coin) {
      setCurrentPrice(coin.price);
      setPrice(coin.price.toString());
    }
  }, [symbol, marketData]);

  useEffect(() => {
    const calculatedTotal = parseFloat(price) * parseFloat(amount);
    setTotal(isNaN(calculatedTotal) ? 0 : calculatedTotal);
  }, [price, amount]);

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handlePercentageClick = (percentage) => {
    if (orderType === 'buy') {
      const maxAmount = (user?.balance?.krw || 0) / currentPrice;
      const newAmount = (maxAmount * percentage / 100).toFixed(8);
      setAmount(newAmount);
    } else {
      const coinSymbol = symbol.split('/')[0];
      const maxAmount = user?.balance?.[coinSymbol] || 0;
      const newAmount = (maxAmount * percentage / 100).toFixed(8);
      setAmount(newAmount);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement order submission
    console.log('Order submitted:', {
      symbol,
      type: orderType,
      price: parseFloat(price),
      amount: parseFloat(amount),
      total: total
    });
  };

  return (
    <div className="order-form">
      <div className="order-tabs">
        <button
          className={`order-tab ${orderType === 'buy' ? 'active' : ''}`}
          onClick={() => onOrderTypeChange('buy')}
        >
          매수
        </button>
        <button
          className={`order-tab ${orderType === 'sell' ? 'active' : ''}`}
          onClick={() => onOrderTypeChange('sell')}
        >
          매도
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>가격 (KRW)</label>
          <input
            type="text"
            value={price}
            onChange={handlePriceChange}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label>수량</label>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
          />
        </div>

        <div className="percentage-buttons">
          <button type="button" onClick={() => handlePercentageClick(25)}>25%</button>
          <button type="button" onClick={() => handlePercentageClick(50)}>50%</button>
          <button type="button" onClick={() => handlePercentageClick(75)}>75%</button>
          <button type="button" onClick={() => handlePercentageClick(100)}>100%</button>
        </div>

        <div className="form-group">
          <label>총액 (KRW)</label>
          <div className="total-amount">{total.toLocaleString()} KRW</div>
        </div>

        <button
          type="submit"
          className={`submit-button ${orderType}`}
        >
          {orderType === 'buy' ? '매수하기' : '매도하기'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm; 