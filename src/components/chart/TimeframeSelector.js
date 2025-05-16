import React from 'react';
import './TimeframeSelector.css';

const TimeframeSelector = ({ activeTimeframe, onTimeframeChange }) => {
  const timeframes = [
    { label: '30분', value: '30m' },
    { label: '1시간', value: '1H' },
    { label: '4시간', value: '4H' },
    { label: '1일', value: '1D' },
    { label: '1주', value: '1W' },
    { label: '1달', value: '1M' }
  ];

  return (
    <div className="timeframe-selector">
      {timeframes.map(timeframe => (
        <button
          key={timeframe.value}
          className={`timeframe-button ${activeTimeframe === timeframe.value ? 'active' : ''}`}
          onClick={() => onTimeframeChange(timeframe.value)}
        >
          {timeframe.label}
        </button>
      ))}
    </div>
  );
};

export default TimeframeSelector;
