import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
  ReferenceLine,
  Brush
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { useCryptoData } from '../../context/CryptoDataContext';
import CandlestickSeries from './CandlestickSeries';
import ChartToolbar from './ChartToolbar';
import PriceInfoPanel from './PriceInfoPanel';
import '../../styles/CryptoChart.css';

const TIME_RANGES = [
  { label: '30분', value: '30m', interval: 1 },
  { label: '1시간', value: '1h', interval: 2 },
  { label: '4시간', value: '4h', interval: 8 },
  { label: '1일', value: '1d', interval: 24 },
  { label: '1주', value: '1w', interval: 168 },
  { label: '1달', value: '1M', interval: 720 }
];

const CHART_TYPES = [
  { label: '캔들', value: 'candle' },
  { label: '라인', value: 'line' }
];

const CryptoChart = () => {
  const { symbol } = useParams();
  const { theme } = useTheme();
  const { getCandleData, getRealtimePrice } = useCryptoData();
  const chartContainerRef = useRef(null);
  
  // 상태 관리
  const [timeRange, setTimeRange] = useState('1d');
  const [chartType, setChartType] = useState('candle');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState({ value: 0, percentage: 0 });
  const [showVolume, setShowVolume] = useState(true);
  const [showToolbar, setShowToolbar] = useState(true);
  const [annotations, setAnnotations] = useState([]);
  const [drawingMode, setDrawingMode] = useState(null);
  const [chartHeight, setChartHeight] = useState(400);
  
  // 차트 데이터 불러오기
  useEffect(() => {
    const fetchChartData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        // 실제 구현 시 API 호출
        const data = await getCandleData(symbol, timeRange);
        setChartData(data);
        setError(null);
      } catch (err) {
        console.error('차트 데이터 로딩 실패:', err);
        setError('차트 데이터를 불러오는 데 실패했습니다.');
        // 실제 앱에서는 예시 데이터 대신 실제 API 결과 사용
        setChartData(generateDummyData(timeRange));
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
    
    // 실시간 가격 업데이트
    const priceInterval = setInterval(async () => {
      try {
        const { price, change, changePercent } = await getRealtimePrice(symbol);
        setCurrentPrice(price);
        setPriceChange({ value: change, percentage: changePercent });
      } catch (err) {
        console.error('실시간 가격 업데이트 실패:', err);
        // 예시 데이터
        setCurrentPrice(144313000);
        setPriceChange({ value: -651000, percentage: -0.45 });
      }
    }, 3000);
    
    return () => clearInterval(priceInterval);
  }, [symbol, timeRange, getCandleData, getRealtimePrice]);
  
  // 차트 크기 조정
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.offsetWidth;
        // 16:9 비율 유지, 최소 높이 350px, 최대 높이 600px
        const calculatedHeight = Math.min(Math.max(width * 0.6, 350), 600);
        setChartHeight(calculatedHeight);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // 차트 타입 변경 핸들러
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };
  
  // 시간 범위 변경 핸들러
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };
  
  // 볼륨 표시 토글
  const toggleVolume = () => {
    setShowVolume(!showVolume);
  };
  
  // 툴바 표시 토글
  const toggleToolbar = () => {
    setShowToolbar(!showToolbar);
  };
  
  // 차트에 주석 추가
  const addAnnotation = (annotation) => {
    setAnnotations([...annotations, annotation]);
  };
  
  // 드로잉 모드 변경
  const setDrawingTool = (tool) => {
    setDrawingMode(tool);
  };
  
  // 차트 초기화
  const resetChart = () => {
    setAnnotations([]);
    setDrawingMode(null);
  };
  
  // 예시 데이터 생성 함수 (실제 앱에서는 API 데이터 사용)
  const generateDummyData = (range) => {
    const now = new Date();
    const data = [];
    const intervals = range === '1d' ? 24 : 30;
    
    let basePrice = 144000000;
    let prevClose = basePrice;
    
    for (let i = 0; i < intervals; i++) {
      const time = new Date(now);
      
      if (range === '30m') time.setMinutes(time.getMinutes() - (intervals - i) * 30);
      else if (range === '1h') time.setHours(time.getHours() - (intervals - i));
      else if (range === '4h') time.setHours(time.getHours() - (intervals - i) * 4);
      else if (range === '1d') time.setDate(time.getDate() - (intervals - i));
      else if (range === '1w') time.setDate(time.getDate() - (intervals - i) * 7);
      else if (range === '1M') time.setMonth(time.getMonth() - (intervals - i));
      
      const variance = Math.random() * 0.03 - 0.015; // -1.5% to +1.5%
      const change = prevClose * variance;
      
      const open = prevClose;
      const close = Math.round(open + change);
      const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.01));
      const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.01));
      const volume = Math.round(Math.random() * 50000000 + 50000000);
      
      data.push({
        time: time.toISOString(),
        timeLabel: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dateLabel: time.toLocaleDateString(),
        open,
        high,
        low,
        close,
        volume,
        ma5: Math.round(basePrice * (1 + (Math.sin(i * 0.2) * 0.02))),
        ma20: Math.round(basePrice * (1 + (Math.cos(i * 0.1) * 0.01)))
      });
      
      prevClose = close;
    }
    
    return data;
  };
  
  // 차트 툴팁 커스터마이징
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-time">{`${data.dateLabel} ${data.timeLabel}`}</p>
          <div className="tooltip-price">
            <div className="tooltip-item">
              <span className="label">시가:</span>
              <span className="value">{data.open.toLocaleString()}</span>
            </div>
            <div className="tooltip-item">
              <span className="label">고가:</span>
              <span className="value">{data.high.toLocaleString()}</span>
            </div>
            <div className="tooltip-item">
              <span className="label">저가:</span>
              <span className="value">{data.low.toLocaleString()}</span>
            </div>
            <div className="tooltip-item">
              <span className="label">종가:</span>
              <span className={`value ${data.close >= data.open ? 'price-up' : 'price-down'}`}>
                {data.close.toLocaleString()}
              </span>
            </div>
          </div>
          {showVolume && (
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
  
  // 렌더링
  return (
    <div className={`crypto-chart-container ${theme}`} ref={chartContainerRef}>
      {/* 가격 정보 패널 */}
      <PriceInfoPanel 
        symbol={symbol || 'BTC'} 
        currentPrice={currentPrice} 
        priceChange={priceChange}
      />
      
      {/* 차트 도구 선택 */}
      <div className="chart-controls">
        <div className="time-range-selector">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              className={`range-button ${timeRange === range.value ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </div>
        
        <div className="chart-type-selector">
          {CHART_TYPES.map((type) => (
            <button
              key={type.value}
              className={`type-button ${chartType === type.value ? 'active' : ''}`}
              onClick={() => handleChartTypeChange(type.value)}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        <div className="chart-options">
          <button 
            className={`option-button ${showVolume ? 'active' : ''}`}
            onClick={toggleVolume}
            title="거래량 표시"
          >
            거래량
          </button>
          <button 
            className="option-button"
            onClick={toggleToolbar}
            title="차트 도구"
          >
            도구
          </button>
          <button 
            className="option-button"
            onClick={resetChart}
            title="차트 초기화"
          >
            초기화
          </button>
        </div>
      </div>
      
      {/* 차트 툴바 */}
      {showToolbar && (
        <ChartToolbar 
          onDrawingToolChange={setDrawingTool} 
          drawingMode={drawingMode}
          onAddAnnotation={addAnnotation}
        />
      )}
      
      {/* 메인 차트 */}
      <div className="chart-wrapper" style={{ height: chartHeight }}>
        {loading ? (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <p>차트 데이터 로딩 중...</p>
          </div>
        ) : error ? (
          <div className="chart-error">
            <p>{error}</p>
            <button onClick={() => setTimeRange(timeRange)} className="retry-button">
              다시 시도
            </button>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(160, 160, 160, 0.2)" />
              <XAxis 
                dataKey="timeLabel" 
                scale="band" 
                tick={{ fontSize: 12 }}
                tickFormatter={(tick, index) => {
                  // 일부 틱만 표시하여 가독성 향상
                  return index % 3 === 0 ? tick : '';
                }}
              />
              <YAxis 
                yAxisId="price" 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 12 }}
                tickFormatter={(tick) => {
                  // 단위에 따라 포맷 조정
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
                  data={chartData} 
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
              
              {/* 차트에 추가된 주석 렌더링 */}
              {annotations.map((annotation, index) => (
                <ReferenceLine
                  key={`annotation-${index}`}
                  yAxisId="price"
                  {...annotation}
                />
              ))}
              
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {/* 브러시로 구간 선택 기능 */}
              <Brush 
                dataKey="timeLabel" 
                height={30} 
                stroke="#8884d8"
                fill="rgba(200, 200, 255, 0.1)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* 차트 정보 */}
      <div className="chart-info-footer">
        <div className="chart-disclaimer">
          * 차트 정보는 실시간 데이터로, 10분 지연될 수 있습니다.
        </div>
        <div className="data-source">
          데이터 제공: Upbit
        </div>
      </div>
    </div>
  );
};

export default CryptoChart;
