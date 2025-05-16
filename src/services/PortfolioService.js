import api from './api';

const PortfolioService = {
  // 포트폴리오 정보 조회
  getPortfolio: async () => {
    try {
      const response = await api.get('/api/portfolio');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 자산 내역 조회
  getAssets: async () => {
    try {
      const response = await api.get('/api/portfolio/assets');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 거래 내역 조회
  getTransactions: async (params) => {
    try {
      const response = await api.get('/api/portfolio/transactions', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default PortfolioService; 