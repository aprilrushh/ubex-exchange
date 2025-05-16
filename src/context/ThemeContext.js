// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 초기 테마를 localStorage에서 가져오거나 OS 설정을 따르거나 기본값(light)으로 설정
    const savedTheme = localStorage.getItem('app-theme');
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || /*(prefersDark ? 'dark' : 'light') ||*/ 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('app-theme', newTheme); // 변경된 테마를 localStorage에 저장
      return newTheme;
    });
  };

  // 테마가 변경될 때마다 body의 클래스를 업데이트하여 CSS에서 활용
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    console.log(`[ThemeContext] Theme changed to: ${theme}`);
  }, [theme]);

  // value 객체는 theme 상태가 변경될 때만 재생성되도록 useMemo 사용
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
