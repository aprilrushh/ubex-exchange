import React from 'react';
import './ChartToolbar.css';

const DRAWING_TOOLS = [
  { id: 'line', label: '직선', icon: '/' },
  { id: 'horizontal', label: '수평선', icon: '—' },
  { id: 'vertical', label: '수직선', icon: '|' },
  { id: 'fibonacci', label: '피보나치', icon: 'F' },
  { id: 'rectangle', label: '사각형', icon: '□' },
  { id: 'arrow', label: '화살표', icon: '↗' },
  { id: 'text', label: '텍스트', icon: 'T' }
];

const INDICATORS = [
  { id: 'ma', label: '이동평균선', submenu: ['MA5', 'MA10', 'MA20', 'MA50', 'MA120'] },
  { id: 'bb', label: '볼린저밴드', submenu: ['20, 2', '20, 3'] },
  { id: 'macd', label: 'MACD', submenu: ['12, 26, 9'] },
  { id: 'rsi', label: 'RSI', submenu: ['14', '21'] },
  { id: 'sto', label: '스토캐스틱', submenu: ['9, 3, 3', '14, 3, 3'] }
];

const ChartToolbar = ({ onDrawingToolChange, drawingMode, onAddIndicator }) => {
  // 드로잉 툴 선택 핸들러
  const handleDrawingToolSelect = (tool) => {
    onDrawingToolChange(drawingMode === tool ? null : tool);
  };
  
  // 지표 추가 핸들러
  const handleAddIndicator = (indicator, param) => {
    // 실제 구현에서는 차트에 지표 추가 로직 구현
    console.log(`Adding indicator: ${indicator} with params: ${param}`);
    if (onAddIndicator) {
      onAddIndicator(indicator, param);
    }
  };
  
  // 서브메뉴 렌더링
  const renderSubmenu = (item) => {
    return (
      <div className="toolbar-submenu">
        {item.submenu.map((subitem) => (
          <button
            key={`${item.id}-${subitem}`}
            className="submenu-item"
            onClick={() => handleAddIndicator(item.id, subitem)}
          >
            {subitem}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="chart-toolbar">
      <div className="toolbar-section">
        <h4 className="toolbar-title">그리기 도구</h4>
        <div className="drawing-tools">
          {DRAWING_TOOLS.map((tool) => (
            <button
              key={tool.id}
              className={`tool-button ${drawingMode === tool.id ? 'active' : ''}`}
              onClick={() => handleDrawingToolSelect(tool.id)}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
      </div>
      
      <div className="toolbar-section">
        <h4 className="toolbar-title">지표</h4>
        <div className="indicators">
          {INDICATORS.map((indicator) => (
            <div key={indicator.id} className="indicator-dropdown">
              <button className="indicator-button">
                {indicator.label}
              </button>
              {renderSubmenu(indicator)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartToolbar;
