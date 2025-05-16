// src/components/Chart/SimpleChart.js  15-05-2025 11:53pm
import React from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import CandlestickSeries from './CandlestickSeries';
import '../../styles/SimpleChart.css';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="tooltip-time">{`${data.dateLabel} ${data.timeLabel}`}</p>
        <div className="tooltip-price">
          <div className="tooltip-item">
            <span className="label">시가:</span>
            <span className="value">{data.open ? data.open.toLocaleString() : '-'}</span>
          </div>
          <div className="tooltip-item">
            <span className="label">고가:</span>
            <span className="value">{data.high ? data.high.toLocaleString() : '-'}</span>
          </div>
          <div className="tooltip-item">
            <span className="label">저가:</span>
            <span className="value">{data.low ? data.low.toLocaleString() : '-'}</span>
          </div>
          <div className="tooltip-item">
            <span className="label">종가:</span>
            <span className={`value ${data.close >= data.open ? 'price-up' : 'price-down'}`}>
              {data.close ? data.close.toLocaleString() : '-'}
            </span>
          </div>
        </div>
        {data.volume && (
          <div className="tooltip-item">
            <span className="label">거래량:</span>
            <span className="value">{data.volume.toLocaleString()}</span>
          </div>
        )}
      </div>
    );
  }
  
  return null;
};

const SimpleChart = ({ data, loading, error, chartType, showVolume, currentPrice }) => {
  const { theme } = useTheme();
  
  if (loading) {
    return (
      <div className={`chart-loading ${theme}`}>
        <div className="loading-spinner"></div>
        <p>차트 데이터 로딩 중...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={`chart-error ${theme}`}>
        <p>{error}</p>
        <button className="retry-button">다시 시도</button>
      </div>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <div className={`chart-empty ${theme}`}>
        <p>표시할 데이터가 없습니다.</p>
      </div>
    );
  }
  
  return (
    <div className={`simple-chart-container ${theme}`}>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 160, 160, 0.2)" />
          
          <XAxis 
            dataKey="timeLabel" 
            scale="band" 
            tick={{ fontSize: 12 }}
            tickFormatter={(tick, index) => {
              return index % 3 === 0 ? tick : '';
            }}
          />
          
          <YAxis 
            yAxisId="price" 
            domain={['auto', 'auto']} 
            tick={{ fontSize: 12 }}
            tickFormatter={(tick) => {
              if (tick >= 1000000) {
                return `${(tick / 1000000).toFixed(1)}M`;
              } else if (tick >= 1000) {
                return `${(tick / 1000).toFixed(0)}K`;
              }
              return tick;
            }}
            orientation="right"
            tickCount={8}
          />
          
          {showVolume && (
            <YAxis 
              yAxisId="volume" 
              orientation="left" 
              domain={['auto', 'auto']}
              tickFormatter={(tick) => {
                if (tick >= 1000000000) {
                  return `${(tick / 1000000000).toFixed(1)}B`;
                } else if (tick >= 1000000) {
                  return `${(tick / 1000000).toFixed(0)}M`;
                } else if (tick >= 1000) {
                  return `${(tick / 1000).toFixed(0)}K`;
                }
                return tick;
              }}
              tick={{ fontSize: 12 }}
              tickCount={4}
            />
          )}
          
          {/* 이동평균선 */}
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="ma5"
            stroke="#f6b93b"
            dot={false}
            strokeWidth={1.5}
            name="5일 이동평균"
          />
          
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="ma20"
            stroke="#8e44ad"
            dot={false}
            strokeWidth={1.5}
            name="20일 이동평균"
          />
          
          {/* 캔들스틱 또는 라인 차트 */}
          {chartType === 'candle' ? (
            <CandlestickSeries 
              yAxisId="price" 
              data={data} 
              upColor="#f75467" 
              downColor="#0062df"
            />
          ) : (
            <Line
              yAxisId="price"
              type="linear"
              dataKey="close"
              stroke="#2196f3"
              dot={false}
              strokeWidth={2}
              name="가격"
            />
          )}
          
          {/* 거래량 바 */}
          {showVolume && (
            <Bar
              yAxisId="volume"
              dataKey="volume"
              barSize={6}
              fill="rgba(120, 120, 220, 0.5)"
              name="거래량"
            />
          )}
          
          {/* 현재가 라인 */}
          {currentPrice && (
            <ReferenceLine
              yAxisId="price"
              y={currentPrice}
              stroke="#ff8f00"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                value: currentPrice.toLocaleString(),
                position: 'right',
                fill: '#ff8f00',
                fontSize: 12
              }}
            />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleChart;
