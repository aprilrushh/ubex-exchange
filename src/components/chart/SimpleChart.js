import React, { useRef, useEffect, useState } from 'react';
import * as LightweightCharts from 'lightweight-charts';
import './SimpleChart.css';

const SimpleChart = ({ 
  data = [], 
  type = 'candle', 
  timeframe = '1D', 
  symbol = 'BTC/KRW',
  chartHeight = 400
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const resizeObserver = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // 차트 데이터 생성 (예시 데이터 - 실제 데이터가 없을 경우)
  const generateDummyData = () => {
    const now = new Date();
    const result = [];
    const basePrice = 144000000; // 기본 가격 (BTC/KRW 예시)
    let prevClose = basePrice;
    
    // 타임프레임에 따라 데이터 포인트 수와 간격 결정
    const getTimeConfig = () => {
      switch (timeframe) {
        case '30m': return { count: 48, interval: 30 * 60 * 1000, unit: 'minute' };
        case '1H': return { count: 24, interval: 60 * 60 * 1000, unit: 'hour' };
        case '4H': return { count: 36, interval: 4 * 60 * 60 * 1000, unit: 'hour' };
        case '1D': return { count: 30, interval: 24 * 60 * 60 * 1000, unit: 'day' };
        case '1W': return { count: 30, interval: 7 * 24 * 60 * 60 * 1000, unit: 'week' };
        case '1M': return { count: 24, interval: 30 * 24 * 60 * 60 * 1000, unit: 'month' };
        default: return { count: 30, interval: 24 * 60 * 60 * 1000, unit: 'day' };
      }
    };
    
    const { count, interval, unit } = getTimeConfig();
    
    for (let i = count - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * interval));
      const randomFactor = Math.random() * 0.03 - 0.015; // -1.5% to +1.5%
      const change = prevClose * randomFactor;
      
      const open = prevClose;
      const close = Math.round(open + change);
      const high = Math.round(Math.max(open, close) * (1 + Math.random() * 0.01));
      const low = Math.round(Math.min(open, close) * (1 - Math.random() * 0.01));
      const volume = Math.round(Math.random() * 1000 + 100);
      
      result.push({
        time: time.getTime() / 1000,
        open,
        high,
        low,
        close,
        volume
      });
      
      prevClose = close;
    }
    
    return result;
  };

  // 컨테이너 크기 변경 감지
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const updateWidth = () => {
      if (chartContainerRef.current) {
        setContainerWidth(chartContainerRef.current.clientWidth);
      }
    };

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 차트 초기화 및 업데이트
  useEffect(() => {
    if (!chartContainerRef.current || containerWidth === 0) return;
    
    // 기존 차트 제거
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    
    const chartData = data.length > 0 ? data : generateDummyData();
    
    // 차트 생성
    const chart = LightweightCharts.createChart(chartContainerRef.current, {
      width: containerWidth,
      height: chartHeight,
      layout: {
        background: { type: LightweightCharts.ColorType.Solid, color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#f0f0f0',
      },
      timeScale: {
        borderColor: '#f0f0f0',
        timeVisible: true,
        secondsVisible: false,
      },
    });
    
    // 다크 모드 감지 및 적용
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
      chart.applyOptions({
        layout: {
          background: { type: LightweightCharts.ColorType.Solid, color: '#1e2233' },
          textColor: '#e9ecef',
        },
        grid: {
          vertLines: { color: '#242836' },
          horzLines: { color: '#242836' },
        },
      });
    }
    
    // 캔들스틱 시리즈 추가
    const mainSeries = chart.addCandlestickSeries({
      upColor: '#f75467',
      downColor: '#0062df',
      borderVisible: false,
      wickUpColor: '#f75467',
      wickDownColor: '#0062df',
    });
    
    mainSeries.setData(chartData);
    
    // 이동평균선 추가 (MA5, MA20)
    const calculateMA = (data, period) => {
      const result = [];
      
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          continue; // 초기 데이터는 건너뜀
        }
        
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j].close;
        }
        
        result.push({
          time: data[i].time,
          value: sum / period,
        });
      }
      
      return result;
    };
    
    const ma5Series = chart.addLineSeries({
      color: '#f6b93b',
      lineWidth: 1.5,
      title: 'MA5',
    });
    
    const ma20Series = chart.addLineSeries({
      color: '#8e44ad',
      lineWidth: 1.5,
      title: 'MA20',
    });
    
    const ma5Data = calculateMA(chartData, 5);
    const ma20Data = calculateMA(chartData, 20);
    
    if (ma5Data.length > 0) {
      ma5Series.setData(ma5Data);
    }
    
    if (ma20Data.length > 0) {
      ma20Series.setData(ma20Data);
    }
    
    // 마커 추가 (현재가 표시)
    const currentPrice = chartData[chartData.length - 1].close;
    
    mainSeries.createPriceLine({
      price: currentPrice,
      color: '#ff8f00',
      lineWidth: 1,
      lineStyle: 2, // 점선
      axisLabelVisible: true,
      title: '현재가',
    });
    
    chartRef.current = chart;
    
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, type, timeframe, symbol, chartHeight, containerWidth]);

  return (
    <div className="simple-chart-container">
      <div className="chart-wrapper" ref={chartContainerRef}></div>
    </div>
  );
};

export default SimpleChart;
