import React, { useMemo } from 'react';
import { Rectangle, Line } from 'recharts';

// 커스텀 캔들스틱 컴포넌트
// Recharts는 기본적으로 캔들스틱 차트를 지원하지 않아 직접 구현
const CandlestickSeries = ({ data, yAxisId, upColor = "#f75467", downColor = "#0062df" }) => {
  const candlesticks = useMemo(() => {
    if (!data || !data.length) return null;
    
    return data.map((candle, index) => {
      const isUp = candle.close >= candle.open;
      const color = isUp ? upColor : downColor;
      
      // 캔들 너비 계산 (데이터 포인트 수에 따라 동적 조정)
      const width = Math.max(100 / data.length, 3);
      const offset = width / 2;
      
      return (
        <g key={`candle-${index}`} className="candlestick">
          {/* 캔들 심지 (고가-저가) */}
          <Line
            yAxisId={yAxisId}
            stroke={color}
            strokeWidth={1}
            x1={index + 0.5}
            x2={index + 0.5}
            y1={candle.low}
            y2={candle.high}
          />
          
          {/* 캔들 몸통 (시가-종가) */}
          <Rectangle
            yAxisId={yAxisId}
            x={index + 0.5 - offset / 2}
            y={isUp ? candle.open : candle.close}
            width={offset}
            height={Math.abs(candle.close - candle.open) || 1} // 최소 높이 1 설정
            fill={color}
            stroke={color}
          />
        </g>
      );
    });
  }, [data, yAxisId, upColor, downColor]);

  return <g className="candlestick-series">{candlesticks}</g>;
};

export default CandlestickSeries;
