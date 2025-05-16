import api from './api';

const TradeService = {
  // 주문 생성
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/api/trade/order', orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 주문 취소
  cancelOrder: async (orderId) => {
    try {
      const response = await api.delete(`/api/trade/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 주문 목록 조회
  getOrders: async (params) => {
    try {
      const response = await api.get('/api/trade/orders', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 체결 내역 조회
  getTrades: async (params) => {
    try {
      const response = await api.get('/api/trade/trades', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default TradeService; 