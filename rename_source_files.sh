#!/bin/bash

# usdb-exchange1/source 디렉토리로 이동
cd source || { echo "source 디렉토리를 찾을 수 없습니다"; exit 1; }

echo "파일 이름 변경 시작..."

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

# JS 파일 이름 수정 (예: crypto-list-js.js → Crypto-List.js)
rename_file "app-js.js" "App.js"
rename_file "header-js.js" "Header.js"
rename_file "trading-layout-js.js" "Trading-Layout.js"
rename_file "index-js.js" "Index.js"
rename_file "price-info-panel-js.js" "Price-Info-Panel.js"
rename_file "chart-toolbar-js.js" "Chart-Toolbar.js"
rename_file "candlestick-series-js.js" "Candlestick-Series.js"
rename_file "crypto-chart-js.js" "Crypto-Chart.js"

# CSS 파일 이름 수정
rename_file "cryptochart-css.css" "Cryptochart-Css.css"
rename_file "cryptolist-css.css" "Cryptolist-Css.css"
rename_file "header-css.css" "Header-Css.css"
rename_file "tradinglayout-css.css" "Tradinglayout-Css.css"
rename_file "app-css.css" "App-Css.css"

echo "파일 이름 변경 완료!"
