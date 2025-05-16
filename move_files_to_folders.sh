#!/bin/bash

# source 디렉토리로 이동
cd source || { echo "source 디렉토리를 찾을 수 없습니다"; exit 1; }

echo "파일 이동 시작..."

# 필요한 디렉토리 구조 확인 및 생성
mkdir -p src/components/layout
mkdir -p src/components/Chart
mkdir -p src/pages
mkdir -p src/context
mkdir -p src/styles

# 파일 이동 함수
move_file() {
  local file="$1"
  local destination="$2"
  
  if [ -f "$file" ]; then
    if [ -f "$destination/$file" ]; then
      echo "파일 대체: $file → $destination/$file"
      rm "$destination/$file"
    else
      echo "파일 이동: $file → $destination/$file"
    fi
    mv "$file" "$destination/"
  else
    echo "파일을 찾을 수 없음: $file"
  fi
}

# 컨텍스트 파일 이동
move_file "CryptoData-Context.js" "src/context"
move_file "Order-Context.js" "src/context"
move_file "Market-Context.js" "src/context"
move_file "Auth-Context.js" "src/context"
move_file "Theme-Context.js" "src/context"
move_file "Theme-Context (1).js" "src/context"  # 이 파일은 중복일 수 있습니다

# 레이아웃 컴포넌트 이동
move_file "Trading-Layout.js" "src/components/layout"

# 페이지 파일 이동
move_file "Withdraw-Page.js" "src/pages"
move_file "Deposit-Page.js" "src/pages"
move_file "Invest-Page.js" "src/pages"
move_file "Balance-Page.js" "src/pages"
move_file "Trading-Page.js" "src/pages"

# 차트 관련 컴포넌트 이동
move_file "Simple-Chart.js" "src/components/Chart"
move_file "Chart-Toolbar-Css.css" "src/components/Chart"
move_file "Price-Info-Panel-Css.css" "src/components/Chart"
move_file "Simple-Chart-Css.css" "src/components/Chart"

# 메인 앱 파일 이동
move_file "App.js" "src"
move_file "Index.js" "src"

# CSS 파일 이동
move_file "Trading-Layout-Css.css" "src/styles"
move_file "Trading-Page-Css.css" "src/styles"
move_file "App-Css.css" "src/styles"
move_file "Index-Css.css" "src/styles"

# 국제화 파일 이동
move_file "i18n-js.js" "src"

echo "파일 이동 완료!"
