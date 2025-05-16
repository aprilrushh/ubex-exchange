import React, { createContext, useContext, useState } from 'react';

// 주문 컨텍스트 생성
const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  // 주문 내역 상태
  const [orders, setOrders] = useState([]);
  // 미체결 주문 상태
  const [pendingOrders, setPendingOrders] = useState([]);
  // 완료된 주문 상태
  const [completedOrders, setCompletedOrders] = useState([]);

  // 새 주문 생성
  const createOrder = (orderData) => {
    const newOrder = {
      id: `order-${Date.now()}`,
      status: 'pending', // pending, completed, canceled
      createdAt: new Date().toISOString(),
      ...orderData
    };

    // 주문 목록에 추가
    setOrders(prevOrders => [...prevOrders, newOrder]);
    
    // 미체결 주문에 추가
    setPendingOrders(prevPending => [...prevPending, newOrder]);
    
    // 실제 애플리케이션에서는 여기서 API 호출
    console.log('New order created:', newOrder);
    
    // 시뮬레이션: 50% 확률로 5초 후 주문 체결
    if (Math.random() > 0.5) {
      setTimeout(() => {
        completeOrder(newOrder.id);
      }, 5000);
    }
    
    return newOrder;
  };

  // 주문 취소
  const cancelOrder = (orderId) => {
    // 주문 상태 업데이트
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'canceled' } : order
      )
    );
    
    // 미체결 주문에서 제거
    setPendingOrders(prevPending =>
      prevPending.filter(order => order.id !== orderId)
    );
    
    // 실제 애플리케이션에서는 여기서 API 호출
    console.log('Order canceled:', orderId);
  };

  // 주문 체결
  const completeOrder = (orderId) => {
    // 주문 상태 업데이트
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'completed' } : order
      )
    );
    
    // 미체결 주문에서 제거하고 완료된 주문에 추가
    setPendingOrders(prevPending => {
      const completedOrder = prevPending.find(order => order.id === orderId);
      if (completedOrder) {
        setCompletedOrders(prevCompleted => [...prevCompleted, { ...completedOrder, status: 'completed' }]);
      }
      return prevPending.filter(order => order.id !== orderId);
    });
    
    // 실제 애플리케이션에서는 여기서 API 호출
    console.log('Order completed:', orderId);
  };

  // 주문 추가 (OrderForm에서 사용)
  const addOrder = (orderData) => {
    return createOrder(orderData);
  };

  // 컨텍스트 값
  const contextValue = {
    orders,
    pendingOrders,
    completedOrders,
    createOrder,
    cancelOrder,
    completeOrder,
    addOrder
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export { OrderContext };
