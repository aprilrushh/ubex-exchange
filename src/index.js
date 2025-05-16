    /* src/styles/index.css */
    :root {
      --primary-blue: #007bff;
      --primary-blue-dark: #0056b3; /* 버튼 호버 등 */
      --secondary-text: #6c757d;   /* 보조 텍스트 */
      --light-text: #adb5bd;       /* 더 연한 텍스트 */
      --border-color: #dee2e6;     /* 테두리 색상 */
      --background-color-light: #f8f9fa; /* 라이트 모드 배경 */
      --panel-color-light: #ffffff;      /* 라이트 모드 패널 */
      --text-color-light: #212529;       /* 라이트 모드 텍스트 */
      --input-bg-light: #ffffff;
      --button-hover-light: #e9ecef;

      --background-color-dark: #1a1d2e;  /* 다크 모드 배경 */
      --panel-color-dark: #232a4a;       /* 다크 모드 패널 */
      --text-color-dark: #e0e0e0;        /* 다크 모드 텍스트 */
      --secondary-text-dark: #98a6ad;
      --border-color-dark: #384152;
      --input-bg-dark: #2c3454;
      --button-hover-dark: #303857;

      /* 업비트 색상 참고 (실제 값은 다를 수 있음) */
      --upbit-red: #d60000; /* 상승 */
      --upbit-blue: #0051c7; /* 하락 */
      --upbit-green: #00b071; /* 상승 (해외 스타일) */


      /* 현재 테마에 따른 변수 설정 (초기값은 라이트 모드) */
      --current-bg: var(--background-color-light);
      --current-panel-bg: var(--panel-color-light);
      --current-text: var(--text-color-light);
      --current-secondary-text: var(--secondary-text);
      --current-border: var(--border-color);
      --current-input-bg: var(--input-bg-light);
      --current-button-hover: var(--button-hover-light);
      --current-price-up: var(--upbit-red);
      --current-price-down: var(--upbit-blue);
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: var(--current-bg);
      color: var(--current-text);
      transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }

    body.dark {
      --current-bg: var(--background-color-dark);
      --current-panel-bg: var(--panel-color-dark);
      --current-text: var(--text-color-dark);
      --current-secondary-text: var(--secondary-text-dark);
      --current-border: var(--border-color-dark);
      --current-input-bg: var(--input-bg-dark);
      --current-button-hover: var(--button-hover-dark);
    }

    /* 기본 링크 스타일 */
    a {
      color: var(--primary-blue);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* 스크롤바 스타일 (선택 사항) */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
    body.dark ::-webkit-scrollbar-thumb {
      background: #444;
    }
    body.dark ::-webkit-scrollbar-thumb:hover {
      background: #666;
    }
    