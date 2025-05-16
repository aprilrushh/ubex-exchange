import React, { useState, useEffect } from 'react';
import { useOrder } from '../../context/OrderContext';
import './TradeHistory.css';

const TradeHistory = ({ symbol }) => {
  const { orders } = useOrder();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled

  useEffect(() => {
    let filtered = orders;
    
    if (symbol) {
      filtered = filtered.filter(order => order.symbol === symbol);
    }
    
    switch (filter) {
      case 'pending':
        filtered = filtered.filter(order => order.status === 'pending');
        break;
      case 'completed':
        filtered = filtered.filter(order => order.status === 'completed');
        break;
      case 'cancelled':
        filtered = filtered.filter(order => order.status === 'cancelled');
        break;
      default:
        break;
    }
    
    // 최신 주문이 먼저 표시되도록 정렬
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredOrders(filtered);
  }, [orders, symbol, filter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const formatAmount = (amount) => {
    return amount.toFixed(8);
  };

  return (
    <div className="trade-history">
      <div className="trade-history-header">
        <h3>주문 내역</h3>
        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            대기중
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            체결완료
          </button>
          <button
            className={filter === 'cancelled' ? 'active' : ''}
            onClick={() => setFilter('cancelled')}
          >
            취소됨
          </button>
        </div>
      </div>

      <div className="trade-history-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className={`trade-item ${order.type} ${order.status}`}>
              <div className="trade-info">
                <div className="trade-type">
                  {order.type === 'buy' ? '매수' : '매도'}
                </div>
                <div className="trade-price">
                  {formatPrice(order.price)} KRW
                </div>
                <div className="trade-amount">
                  {formatAmount(order.amount)} {order.symbol.split('/')[0]}
                </div>
                <div className="trade-total">
                  {formatPrice(order.total)} KRW
                </div>
                <div className="trade-status">
                  {order.status === 'pending' && '대기중'}
                  {order.status === 'completed' && '체결완료'}
                  {order.status === 'cancelled' && '취소됨'}
                </div>
                <div className="trade-time">
                  {formatDate(order.createdAt)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-trades">주문 내역이 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default TradeHistory;
