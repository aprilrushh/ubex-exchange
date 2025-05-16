// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MarketProvider } from './context/MarketContext';
import { OrderProvider } from './context/OrderContext';
import { CryptoDataProvider } from './context/CryptoDataContext';
import TradingLayout from './components/layout/TradingLayout';
import BalancePage from './pages/BalancePage';
import TradingPage from './pages/TradingPage';
import InvestPage from './pages/InvestPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import WalletPage from './pages/WalletPage';
import Navbar from './components/Navbar/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketPage from './pages/MarketPage';
import PrivateRoute from './components/PrivateRoute';
import './styles/global.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <MarketProvider>
            <OrderProvider>
              <CryptoDataProvider>
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/market" element={<MarketPage />} />
                      
                      {/* Protected Routes */}
                      <Route element={<PrivateRoute />}>
                        <Route element={<TradingLayout />}>
                          <Route path="/trading" element={<Navigate to="/trading/BTC/KRW" replace />} />
                          <Route path="/trading/:symbol" element={<TradingPage />} />
                          <Route path="/investments/balance" element={<BalancePage />} />
                          <Route path="/investments/area" element={<InvestPage />} />
                          <Route path="/deposit" element={<DepositPage />} />
                          <Route path="/withdraw" element={<WithdrawPage />} />
                          <Route path="/wallet" element={<WalletPage />} />
                        </Route>
                      </Route>
                    </Routes>
                  </main>
                </div>
              </CryptoDataProvider>
            </OrderProvider>
          </MarketProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;