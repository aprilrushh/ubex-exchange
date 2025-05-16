import React, { useState, useEffect, useMemo } from 'react';
import './OrderBook.css';

const OrderBook = ({ symbol, currentPrice, orders = [] }) => {
  const [grouping, setGrouping] = useState(1000);
  
  // 그룹핑 옵션
  const groupingOptions = [10, 100, 1000, 10000];

  // 주문 데이터 처리 및 계산
  const { bidOrders, askOrders, depthScale } = useMemo(() => {
    // 실제 주문 데이터 또는 더미 데이터 사용
    const orderData = (!orders || !orders.length) 
      ? generateDummyOrders(currentPrice, symbol)
      : orders;

    // 주문 데이터 그룹핑 및 정렬
    const groupedBids = groupOrders(orderData.filter(order => order.type === 'bid'), true, grouping);
    const groupedAsks = groupOrders(orderData.filter(order => order.type === 'ask'), false, grouping);
    
    // 최대 20개만 표시
    const limitedBids = groupedBids.slice(0, 20);
    const limitedAsks = groupedAsks.slice(0, 20);
    
    // 깊이 스케일 계산 (최대 주문량 기준)
    const maxVolume = Math.max(
      ...limitedBids.map(order => order.volume),
      ...limitedAsks.map(order => order.volume)
    );
    
    return {
      bidOrders: limitedBids,
      askOrders: limitedAsks,
      depthScale: maxVolume > 0 ? 100 / maxVolume : 1
    };
  }, [orders, currentPrice, symbol, grouping]);

  // 주문 그룹핑 함수
  function groupOrders(orders, isBid, groupSize) {
    const grouped = {};
    
    orders.forEach(order => {
      const groupPrice = Math.floor(order.price / groupSize) * groupSize;
      
      if (!grouped[groupPrice]) {
        grouped[groupPrice] = {
          price: groupPrice,
          volume: 0,
          total: 0,
          type: isBid ? 'bid' : 'ask'
        };
      }
      
      grouped[groupPrice].volume += order.volume;
      grouped[groupPrice].total += order.price * order.volume;
    });
    
    const result = Object.values(grouped);
    
    result.forEach(item => {
      if (item.volume > 0) {
        item.avgPrice = item.total / item.volume;
      } else {
        item.avgPrice = item.price;
      }
    });
    
    return result.sort((a, b) => 
      isBid ? b.price - a.price : a.price - b.price
    );
  }

  // 더미 데이터 생성 함수
  function generateDummyOrders(basePrice, coinSymbol) {
    if (!basePrice) basePrice = 144000000;
    if (!coinSymbol) coinSymbol = 'BTC';
    
    const dummyOrders = [];
    
    for (let i = 1; i <= 30; i++) {
      const askPrice = basePrice + (i * Math.random() * 100000);
      const bidPrice = basePrice - (i * Math.random() * 100000);
      const volume = Math.random() * 5 + 0.1;
      
      dummyOrders.push(
        {
          id: `ask-${i}`,
          type: 'ask',
          price: askPrice,
          volume,
          total: askPrice * volume,
          symbol: coinSymbol
        },
        {
          id: `bid-${i}`,
          type: 'bid',
          price: bidPrice,
          volume,
          total: bidPrice * volume,
          symbol: coinSymbol
        }
      );
    }
    
    return dummyOrders;
  }

  // 가격 포맷팅
  const formatPrice = (price) => {
    return price.toLocaleString();
  };
  
  // 수량 포맷팅
  const formatVolume = (volume) => {
    if (volume >= 1000) {
      return (volume / 1000).toFixed(2) + 'K';
    }
    return volume.toFixed(4);
  };

  return (
    <div className="order-book">
      <div className="order-book-header">
        <h3 className="order-book-title">호가</h3>
        
        <div className="grouping-controls">
          <span className="grouping-label">단위:</span>
          {groupingOptions.map(option => (
            <button
              key={option}
              className={`grouping-button ${grouping === option ? 'active' : ''}`}
              onClick={() => setGrouping(option)}
            >
              {option.toLocaleString()}
            </button>
          ))}
        </div>
      </div>
      
      <div className="order-list-container">
        {/* 매도 목록 (역순) */}
        <div className="ask-orders">
          <div className="order-header">
            <span className="price-header">가격(KRW)</span>
            <span className="volume-header">{symbol ? symbol.split('/')[0] : 'BTC'} 수량</span>
          </div>
          
          <div className="order-list">
            {askOrders.map((order, index) => (
              <div key={`ask-${index}`} className="order-item ask">
                <div className="depth-bar" style={{ width: `${order.volume * depthScale}%` }}></div>
                <span className="order-price price-down">{formatPrice(order.price)}</span>
                <span className="order-volume">{formatVolume(order.volume)}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* 현재가 */}
        <div className="current-price-info">
          <span className="current-price">{formatPrice(currentPrice)}</span>
        </div>
        
        {/* 매수 목록 */}
        <div className="bid-orders">
          <div className="order-list">
            {bidOrders.map((order, index) => (
              <div key={`bid-${index}`} className="order-item bid">
                <div className="depth-bar" style={{ width: `${order.volume * depthScale}%` }}></div>
                <span className="order-price price-up">{formatPrice(order.price)}</span>
                <span className="order-volume">{formatVolume(order.volume)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
