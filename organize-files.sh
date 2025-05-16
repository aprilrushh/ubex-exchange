#!/bin/bash

# 설정
SOURCE_DIR="./source"
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting file organization for USDB Exchange...${NC}"

# 먼저 source 디렉토리에 있는 파일 목록 확인
echo -e "${YELLOW}Checking source directory files:${NC}"
ls -la $SOURCE_DIR
echo ""

# 필요한 디렉토리 생성
echo -e "${GREEN}Creating directory structure...${NC}"
mkdir -p ./src/{components/{Chart/{Indicators},Wallet,layout,OrderHistory,Portfolio,common,OrderBook,TradeHistory,OrderForm,crypto},context,pages,services,styles} \
         ./public \
         ./backend/{config,controllers,middlewares,routes,services}
echo "Directory structure created."

# 파일 처리 - 더 유연한 파일명 매칭 사용
echo -e "${GREEN}Processing files...${NC}"
for file in "$SOURCE_DIR"/*; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo -e "${YELLOW}Processing file: $filename${NC}"
    
    # 파일 유형 결정 (JavaScript 또는 CSS)
    if [[ "$filename" == *"-js"* || "$filename" == *".js"* ]]; then
      file_type="js"
      extension=".js"
    elif [[ "$filename" == *"-css"* || "$filename" == *".css"* ]]; then
      file_type="css"
      extension=".css"
    else
      file_type="unknown"
      extension=""
    fi
    
    # 파일의 기본 이름 추출 (확장자 제거)
    base_name=$(echo "$filename" | sed -E 's/((-js|-css|\.js|\.css).*$|\.js\.js|\.css\.css)$//')
    echo "Base name: $base_name"
    
    # 카멜케이스로 변환
    camel_case=$(echo "$base_name" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2));}1' RS='-' ORS='')
    
    # 파일명 매칭 (부분 문자열 매칭 사용)
    if [[ "$filename" == *"order-form"* || "$filename" == *"orderform"* ]]; then
      target_dir="./src/components/OrderForm"
      new_name="OrderForm$extension"
    elif [[ "$filename" == *"order-book"* || "$filename" == *"orderbook"* ]]; then
      target_dir="./src/components/OrderBook"
      new_name="OrderBook$extension"
    elif [[ "$filename" == *"price-info"* || "$filename" == *"priceinfo"* ]]; then
      target_dir="./src/components/Chart"
      new_name="PriceInfoPanel$extension"
    elif [[ "$filename" == *"chart-toolbar"* || "$filename" == *"charttoolbar"* ]]; then
      target_dir="./src/components/Chart"
      new_name="ChartToolbar$extension"
    elif [[ "$filename" == *"candlestick"* ]]; then
      target_dir="./src/components/Chart"
      new_name="CandlestickSeries$extension"
    elif [[ "$filename" == *"trade-history"* || "$filename" == *"tradehistory"* ]]; then
      target_dir="./src/components/TradeHistory"
      new_name="TradeHistory$extension"
    elif [[ "$filename" == *"simple-chart"* || "$filename" == *"simplechart"* ]]; then
      target_dir="./src/components/Chart"
      new_name="SimpleChart$extension"
    elif [[ "$filename" == *"timeframe"* ]]; then
      target_dir="./src/components/Chart"
      new_name="TimeframeSelector$extension"
    elif [[ "$filename" == *"indicator"* ]]; then
      target_dir="./src/components/Chart/Indicators"
      new_name="IndicatorSelector$extension"
    elif [[ "$filename" == *"deposit-form"* || "$filename" == *"depositform"* ]]; then
      target_dir="./src/components/Wallet"
      new_name="DepositForm$extension"
    elif [[ "$filename" == *"withdraw"* ]]; then
      target_dir="./src/components/Wallet"
      new_name="WithdrawForm$extension"
    elif [[ "$filename" == *"header"* ]]; then
      target_dir="./src/components/common"
      new_name="Header$extension"
    elif [[ "$filename" == *"trading-layout"* || "$filename" == *"tradinglayout"* ]]; then
      target_dir="./src/components/layout"
      new_name="TradingLayout$extension"
    elif [[ "$filename" == *"auth-context"* || "$filename" == *"authcontext"* ]]; then
      target_dir="./src/context"
      new_name="AuthContext$extension"
    elif [[ "$filename" == *"market-context"* || "$filename" == *"marketcontext"* ]]; then
      target_dir="./src/context"
      new_name="MarketContext$extension"
    elif [[ "$filename" == *"order-context"* || "$filename" == *"ordercontext"* ]]; then
      target_dir="./src/context"
      new_name="OrderContext$extension"
    elif [[ "$filename" == *"theme-context"* || "$filename" == *"themecontext"* ]]; then
      target_dir="./src/context"
      new_name="ThemeContext$extension"
    elif [[ "$filename" == *"trading-page"* || "$filename" == *"tradingpage"* ]]; then
      target_dir="./src/pages"
      new_name="TradingPage$extension"
    elif [[ "$filename" == *"chart-page"* || "$filename" == *"chartpage"* ]]; then
      target_dir="./src/pages"
      new_name="ChartPage$extension"
    elif [[ "$filename" == *"coin-list"* || "$filename" == *"coinlist"* ]]; then
      target_dir="./src/pages"
      new_name="CoinListPage$extension"
    elif [[ "$filename" == *"deposit-withdraw"* ]]; then
      target_dir="./src/pages"
      new_name="DepositWithdrawPage$extension"
    elif [[ "$filename" == *"portfolio-page"* || "$filename" == *"portfoliopage"* ]]; then
      target_dir="./src/pages"
      new_name="PortfolioPage$extension"
    elif [[ "$filename" == *"trade-history-page"* ]]; then
      target_dir="./src/pages"
      new_name="TradeHistoryPage$extension"
    elif [[ "$filename" == "app"* ]]; then
      target_dir="./src"
      new_name="App$extension"
    elif [[ "$filename" == "index"* && "$filename" != *"index-css"* ]]; then
      target_dir="./src"
      new_name="index$extension"
    elif [[ "$filename" == *"index-css"* ]]; then
      target_dir="./src/styles"
      new_name="index$extension"
    elif [[ "$filename" == *"app-css"* ]]; then
      target_dir="./src/styles"
      new_name="App$extension"
    elif [[ "$filename" == *"crypto-list"* || "$filename" == *"cryptolist"* ]]; then
      target_dir="./src/components/crypto"
      new_name="CryptoList$extension"
    # 기본 패턴 매칭
    elif [[ "$filename" == *"context"* ]]; then
      target_dir="./src/context"
      new_name="$camel_case$extension"
    elif [[ "$filename" == *"page"* ]]; then
      target_dir="./src/pages"
      new_name="$camel_case$extension"
    elif [[ "$filename" == *"service"* ]]; then
      target_dir="./src/services"
      new_name="$camel_case$extension"
    elif [[ "$filename" == *"chart"* || "$filename" == *"indicator"* ]]; then
      target_dir="./src/components/Chart"
      new_name="$camel_case$extension"
    elif [[ "$filename" == *"order"* ]]; then
      target_dir="./src/components/OrderForm"
      new_name="$camel_case$extension"
    elif [[ "$filename" == *"trade"* ]]; then
      target_dir="./src/components/TradeHistory"
      new_name="$camel_case$extension"
    elif [[ "$filename" == *"wallet"* ]]; then
      target_dir="./src/components/Wallet"
      new_name="$camel_case$extension"
    elif [[ "$filename" == *"portfolio"* ]]; then
      target_dir="./src/components/Portfolio"
      new_name="$camel_case$extension"
    else
      target_dir="./src/components/common"
      new_name="$camel_case$extension"
    fi
    
    # 파일 복사
    echo "Copying to $target_dir/$new_name"
    mkdir -p "$target_dir" # 디렉토리가 없는 경우를 대비
    cp "$file" "$target_dir/$new_name"
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}Copied: $filename -> $target_dir/$new_name${NC}"
    else
      echo -e "${RED}Failed to copy: $filename -> $target_dir/$new_name${NC}"
    fi
    echo "" # 공백 줄 출력
  fi
done

echo -e "${GREEN}File organization completed!${NC}"
