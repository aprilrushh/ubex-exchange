import React, { useState, useEffect } from 'react';
import './OrderBook.css';

const OrderBook = ({ symbol, currentPrice, orders = [] }) => {
  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);
  const [depthScale, setDepthScale] = useState(1);
  const [grouping, setGrouping] = useState(1000);
  
  // 그룹핑 옵션
  const groupingOptions = [10, 100, 1000, 10000];
  
  // 주문 데이터 처리 및 정렬
  useEffect(() => {
    if (!orders || !orders.length) {
      // 더미 데이터 생성 (실제 앱에서는 실제 데이터 사용)
      const dummyData = generateDummyOrders(currentPrice);
      processOrderData(dummyData);
    } else {
      processOrderData(orders);
    }
  }, [orders, currentPrice, grouping]);
  
  // 주문 데이터 처리
  const processOrderData = (orderData) => {
    // 주문 데이터 그룹핑 및 정렬
    const groupedBids = groupOrders(orderData.filter(order => order.type === 'bid'), true);
    const groupedAsks = groupOrders(orderData.filter(order => order.type === 'ask'), false);
    
    // 최대 20개만 표시
    setBidOrders(groupedBids.slice(0, 20));
    setAskOrders(groupedAsks.slice(0, 20));
    
    // 깊이 스케일 계산 (최대 주문량 기준)
    const maxVolume = Math.max(
      ...groupedBids.map(order => order.volume),
      ...groupedAsks.map(order => order.volume)
    );
    setDepthScale(maxVolume > 0 ? 100 / maxVolume : 1);
  };
  
  // 주문 그룹핑
  const groupOrders = (orders, isBid) => {
    const grouped = {};
    
    orders.forEach(order => {
      // 가격 그룹핑
      const groupPrice = Math.floor(order.price / grouping) * grouping;
      
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
    
    // 객체를 배열로 변환
    const result = Object.values(grouped);
    
    // 평균 가격 계산
    result.forEach(item => {
      if (item.volume > 0) {
        item.avgPrice = item.total / item.volume;
      } else {
        item.avgPrice = item.price;
      }
    });
    
    // 정렬 (매수: 내림차순, 매도: 오름차순)
    return result.sort((a, b) => 
      isBid ? b.price - a.price : a.price - b.price
    );
  };
  
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
  
  // 더미 데이터 생성 (실제 앱에서는 제거)
  const generateDummyOrders = (basePrice) => {
    if (!basePrice) basePrice = 144000000;
    
    const dummyOrders = [];
    const coinSymbol = symbol ? symbol.split('/')[0] : 'BTC';
    
    // 매도 주문
    for (let i = 1; i <= 30; i++) {
      const price = basePrice + (i * Math.random() * 100000);
      const volume = Math.random() * 5 + 0.1;
      
      dummyOrders.push({
        id: `ask-${i}`,
        type: 'ask',
        price,
        volume,
        total: price * volume,
        symbol: coinSymbol
      });
    }
    
    // 매수 주문
    for (let i = 1; i <= 30; i++) {
      const price = basePrice - (i * Math.random() * 100000);
      const volume = Math.random() * 5 + 0.1;
      
      dummyOrders.push({
        id: `bid-${i}`,
        type: 'bid',
        price,
        volume,
        total: price * volume,
        symbol: coinSymbol
      });
    }
    
    return dummyOrders;
  };
  
  // 그룹핑 변경 핸들러
  const handleGroupingChange = (value) => {
    setGrouping(value);
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
              onClick={() => handleGroupingChange(option)}
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
