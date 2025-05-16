// src/components/Chart/CandlestickSeries.js
import React from 'react';
import { Rectangle } from 'recharts';

// A custom candlestick component for Recharts
const CandlestickSeries = ({ data, yAxisId, upColor, downColor }) => {
  // The candlestick series doesn't need to return anything itself since it's just a component
  // that renders individual candlesticks within the chart
  return data.map((entry, index) => {
    const isUp = entry.close >= entry.open;
    const color = isUp ? upColor : downColor;
    
    // Calculate the candle position and size
    const candleY = Math.min(entry.open, entry.close);
    const candleHeight = Math.abs(entry.close - entry.open);
    
    // Prevent zero-height candles which cause rendering issues
    const displayHeight = candleHeight || 1;
    
    // Calculate the wick positions
    const wickY = Math.min(entry.low, candleY);
    const wickHeight = Math.max(entry.high, candleY + displayHeight) - wickY;
    
    return (
      <g key={`candle-${index}`}>
        {/* Candle wick (vertical line) */}
        <line
          x1={index + 0.5}
          y1={wickY}
          x2={index + 0.5}
          y2={wickY + wickHeight}
          stroke={color}
          strokeWidth={1}
        />
        
        {/* Candle body */}
        <Rectangle
          x={index + 0.1}
          y={candleY}
          width={0.8}
          height={displayHeight || 1}
          fill={color}
          stroke={color}
        />
      </g>
    );
  });
};

export default CandlestickSeries;