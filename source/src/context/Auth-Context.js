// src/context/AuthContext.js  15-05-2025 11:48pm
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 로컬 스토리지에서 인증 정보 가져오기
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // 로그인 함수
  const login = async (email, password) => {
    // 실제 앱에서는 API 호출
    setLoading(true);
    
    // 가상의 API 응답 시뮬레이션
    return new Promise((resolve) => {
      setTimeout(() => {
        // 테스트용 자격 증명
        if (email === 'test@example.com' && password === 'password') {
          const userData = {
            id: 1,
            email: 'test@example.com',
            name: '테스트 사용자',
            balance: {
              KRW: 10000000,
              BTC: 0.5,
              ETH: 2.3
            }
          };
          
          const token = 'fake-jwt-token';
          
          // 로컬 스토리지에 저장
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // 상태 업데이트
          setIsAuthenticated(true);
          setUser(userData);
          setLoading(false);
          
          resolve({ success: true, user: userData });
        } else {
          setLoading(false);
          resolve({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }
      }, 1000);
    });
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  // 회원가입 함수
  const register = async (name, email, password) => {
    // 실제 앱에서는 API 호출
    setLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // 가상의 회원가입 처리
        const userData = {
          id: Math.floor(Math.random() * 1000),
          email,
          name,
          balance: {
            KRW: 0,
            BTC: 0,
            ETH: 0
          }
        };
        
        const token = 'fake-jwt-token-new-user';
        
        // 로컬 스토리지에 저장
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // 상태 업데이트
        setIsAuthenticated(true);
        setUser(userData);
        setLoading(false);
        
        resolve({ success: true, user: userData });
      }, 1000);
    });
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 커스텀 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
