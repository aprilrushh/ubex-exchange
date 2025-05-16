#!/bin/bash

# source 디렉토리로 이동
cd source || { echo "source 디렉토리를 찾을 수 없습니다"; exit 1; }

echo "나머지 파일 이름 변경 시작..."

# 파일 이름 변경 함수
rename_file() {
  local old_name="$1"
  local new_name="$2"
  
  if [ -f "$old_name" ]; then
    echo "이름 변경: $old_name → $new_name"
    mv "$old_name" "$new_name"
  else
    echo "파일을 찾을 수 없음: $old_name"
  fi
}

# JS 파일 이름 수정
rename_file "withdraw-page.js" "Withdraw-Page.js"
rename_file "deposit-page.js" "Deposit-Page.js"
rename_file "invest-page.js" "Invest-Page.js"
rename_file "balance-page.js" "Balance-Page.js"
rename_file "simple-chart.js" "Simple-Chart.js"
rename_file "trading-page.js" "Trading-Page.js"
rename_file "order-context.js" "Order-Context.js"
rename_file "market-context.js" "Market-Context.js"
rename_file "auth-context.js" "Auth-Context.js"
rename_file "theme-context.js" "Theme-Context.js"
rename_file "theme-context (1).js" "Theme-Context (1).js"
rename_file "CryptoData-context.js" "CryptoData-Context.js"

# CSS 파일 이름 수정
rename_file "trading-layout-css.css" "Trading-Layout-Css.css"
rename_file "chart-toolbar-css.css" "Chart-Toolbar-Css.css"
rename_file "price-info-panel-css.css" "Price-Info-Panel-Css.css"
rename_file "simple-chart-css.css" "Simple-Chart-Css.css"
rename_file "trading-page-css.css" "Trading-Page-Css.css"
rename_file "index-css.css" "Index-Css.css"

echo "파일 이름 변경 완료!"
