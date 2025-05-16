import React, { createContext, useState, useContext } from 'react';

// 인증 컨텍스트 생성
export const AuthContext = createContext();

// useAuth 훅 생성
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // 인증 상태
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // 사용자 정보
  const [user, setUser] = useState(null);
  // 로딩 상태
  const [loading, setLoading] = useState(false);
  // 에러 상태
  const [error, setError] = useState(null);

  // 로그인
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // 실제 API 호출 대신 시뮬레이션
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ email, password })
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || '로그인에 실패했습니다.');
      // }
      
      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 예시 사용자 데이터
      const userData = {
        id: 'user123',
        email: email,
        name: '사용자',
        balance: {
          KRW: 1000000,
          BTC: 0.05,
          ETH: 0.5
        },
        profileImage: '/images/profile.png'
      };
      
      // 상태 업데이트
      setIsAuthenticated(true);
      setUser(userData);
      
      // 토큰 저장 (실제 구현 시)
      // localStorage.setItem('token', data.token);
      
      return { success: true };
    } catch (err) {
      setError(err.message || '로그인 중 오류가 발생했습니다.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    
    // 토큰 제거 (실제 구현 시)
    // localStorage.removeItem('token');
    
    return true;
  };

  // 회원가입
  const register = async (email, password, name) => {
    setLoading(true);
    setError(null);
    
    try {
      // 실제 API 호출 대신 시뮬레이션
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ email, password, name })
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || '회원가입에 실패했습니다.');
      // }
      
      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (err) {
      setError(err.message || '회원가입 중 오류가 발생했습니다.');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 사용자 정보 가져오기
  const fetchUserProfile = async () => {
    setLoading(true);
    
    try {
      // 실제 API 호출 대신 시뮬레이션
      // const token = localStorage.getItem('token');
      
      // if (!token) {
      //   throw new Error('인증 토큰이 없습니다.');
      // }
      
      // const response = await fetch('/api/auth/profile', {
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      // const data = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(data.message || '프로필을 불러오는데 실패했습니다.');
      // }
      
      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 예시 사용자 데이터
      const userData = {
        id: 'user123',
        email: 'user@example.com',
        name: '사용자',
        balance: {
          KRW: 1000000,
          BTC: 0.05,
          ETH: 0.5
        },
        profileImage: '/images/profile.png'
      };
      
      // 상태 업데이트
      setIsAuthenticated(true);
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (err) {
      setError(err.message || '프로필을 불러오는 중 오류가 발생했습니다.');
      setIsAuthenticated(false);
      setUser(null);
      
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 컨텍스트 값
  const contextValue = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    register,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
