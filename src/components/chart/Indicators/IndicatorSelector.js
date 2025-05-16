import React, { useState } from 'react';
import './IndicatorSelector.css';

const INDICATORS = [
  { id: 'ma', label: '이동평균선', params: ['5', '10', '20', '50', '120'] },
  { id: 'bb', label: '볼린저밴드', params: ['20,2', '20,3'] },
  { id: 'macd', label: 'MACD', params: ['12,26,9'] },
  { id: 'rsi', label: 'RSI', params: ['14', '21'] },
  { id: 'sto', label: '스토캐스틱', params: ['9,3,3', '14,3,3'] }
];

const IndicatorSelector = ({ onSelect }) => {
  const [activeIndicator, setActiveIndicator] = useState(null);

  const handleIndicatorClick = (indicator) => {
    setActiveIndicator(indicator.id === activeIndicator ? null : indicator.id);
  };

  const handleParamClick = (indicatorId, param) => {
    if (onSelect) {
      onSelect(indicatorId, param);
    }
    setActiveIndicator(null);
  };

  return (
    <div className="indicator-selector">
      {INDICATORS.map((indicator) => (
        <div key={indicator.id} className="indicator-item">
          <button
            className={`indicator-button ${activeIndicator === indicator.id ? 'active' : ''}`}
            onClick={() => handleIndicatorClick(indicator)}
          >
            {indicator.label}
          </button>
          
          {activeIndicator === indicator.id && (
            <div className="param-dropdown">
              {indicator.params.map((param) => (
                <button
                  key={param}
                  className="param-button"
                  onClick={() => handleParamClick(indicator.id, param)}
                >
                  {indicator.label} ({param})
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default IndicatorSelector;