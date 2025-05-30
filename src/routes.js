import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CoinListPage from './pages/CoinListPage';
import TradingPage from './pages/TradingPage';
import ChartPage from './pages/ChartPage';
import TradeHistoryPage from './pages/TradeHistoryPage';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CoinListPage />} />
      <Route path="/trade/:symbol" element={<TradingPage />} />
      <Route path="/chart/:symbol" element={<ChartPage />} />
      <Route path="/history/:symbol" element={<TradeHistoryPage />} />
      {/* 추가 라우트는 여기에 정의 */}
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
