import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CryptoDataProvider } from './context/CryptoDataContext';
import './styles/index.css';
import './i18n'; // 다국어 지원 (한국어/영어)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CryptoDataProvider>
          <App />
        </CryptoDataProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
