import React, { createContext, useState, useEffect } from 'react';

// 테마 컨텍스트 생성
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 테마 상태 (light/dark)
  const [theme, setTheme] = useState('light');

  // 로컬 스토리지에서 테마 설정 불러오기 (초기화)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // 시스템 테마 감지
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
  }, []);

  // 테마 전환 함수
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  // HTML 요소에 테마 적용
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = theme;
    
    // 다크 모드일 때 메타 테마 색상 변경 (모바일 브라우저)
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1e2233' : '#ffffff');
    }
  };

  // 컨텍스트 값
  const contextValue = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
