import React, { useRef, useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';
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

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // 기존 차트 제거
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }
    
    const chartData = data.length > 0 ? data : generateDummyData();
    
    // 차트 옵션 설정
    const chartOptions = {
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333333',
      },
      grid: {
        vertLines: { color: '#f0f3fa' },
        horzLines: { color: '#f0f3fa' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#758696',
          style: 0,
        },
        horzLine: {
          width: 1,
          color: '#758696',
          style: 0,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#e9ecef',
      },
      localization: {
        locale: 'ko-KR',
        priceFormatter: price => {
          // 가격에 따라 포맷팅 방식 결정
          if (price >= 1000000) {
            return (price / 1000000).toFixed(2) + 'M';
          } else if (price >= 1000) {
            return (price / 1000).toFixed(1) + 'K';
          }
          return price.toFixed(0);
        },
      },
      rightPriceScale: {
        borderColor: '#e9ecef',
      },
      handleScroll: true,
      handleScale: true,
    };
    
    // 차트 생성
    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: chartHeight,
    });
    
    // 다크 모드 감지 및 적용
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode || document.body.classList.contains('dark')) {
      chart.applyOptions({
        layout: {
          background: { color: '#1e2233' },
          textColor: '#e9ecef',
        },
        grid: {
          vertLines: { color: '#242836' },
          horzLines: { color: '#242836' },
        },
      });
    }
    
    // 시리즈 추가 (캔들스틱 또는 라인)
    let mainSeries;
    if (type === 'candle') {
      mainSeries = chart.addCandlestickSeries({
        upColor: '#f75467',         // 상승 캔들 색상 (빨강)
        downColor: '#0062df',       // 하락 캔들 색상 (파랑)
        borderUpColor: '#f75467',   // 상승 캔들 테두리 색상
        borderDownColor: '#0062df', // 하락 캔들 테두리 색상
        wickUpColor: '#f75467',     // 상승 캔들 심지 색상
        wickDownColor: '#0062df',   // 하락 캔들 심지 색상
      });
    } else {
      mainSeries = chart.addAreaSeries({
        lineColor: '#2196F3',
        topColor: 'rgba(33, 150, 243, 0.4)',
        bottomColor: 'rgba(33, 150, 243, 0.0)',
        lineWidth: 2,
      });
    }
    
    // 데이터 설정
    mainSeries.setData(chartData);
    
    // 거래량 시리즈 추가 (선택적)
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // 별도 스케일 사용 안 함
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    
    // 거래량 데이터 설정 (상승/하락에 따라 색상 변경)
    const volumeData = chartData.map(item => ({
      time: item.time,
      value: item.volume,
      color: item.close >= item.open ? 'rgba(247, 84, 103, 0.3)' : 'rgba(0, 98, 223, 0.3)',
    }));
    
    volumeSeries.setData(volumeData);
    
    // 이동평균선 추가 (MA5, MA20)
    const calculateMA = (data, period) => {
      const result = [];
      
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          result.push({ time: data[i].time, value: null });
          continue;
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
    
    ma5Series.setData(calculateMA(chartData, 5));
    ma20Series.setData(calculateMA(chartData, 20));
    
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
    
    // Resize 이벤트 처리
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    
    resizeObserver.current = new ResizeObserver(handleResize);
    resizeObserver.current.observe(chartContainerRef.current);
    
    chartRef.current = chart;
    
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [data, type, timeframe, symbol, chartHeight]);

  return (
    <div className="simple-chart-container">
      <div className="chart-wrapper" ref={chartContainerRef}></div>
    </div>
  );
};

export default SimpleChart;
