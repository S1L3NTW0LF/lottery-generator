import React, { useState, useEffect } from 'react';

const COLOR_MAP = {
  hot:     { bg: '#ff4d4d', glow: 'rgba(255, 77, 77, 0.6)',  rolling: '#c0392b' },
  cold:    { bg: '#4da6ff', glow: 'rgba(77, 166, 255, 0.6)', rolling: '#2980b9' },
  neutral: { bg: '#34d399', glow: 'rgba(52, 211, 153, 0.5)', rolling: '#27ae60' },
  empty:   { bg: '#1e2133', glow: 'none',                    rolling: '#1e2133' },
};

function Dice({ finalNumber, delay, colorType = 'neutral', isCommon }) {
  const [displayNumber, setDisplayNumber] = useState('?');
  const [rolling, setRolling] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (finalNumber === null || finalNumber === undefined) {
      setDisplayNumber('?');
      setRolling(false);
      setSettled(false);
      return;
    }

    const startDelay = setTimeout(() => {
      setRolling(true);
      setSettled(false);

      const rollInterval = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 47) + 1);
      }, 80);

      const stopDelay = setTimeout(() => {
        clearInterval(rollInterval);
        setDisplayNumber(finalNumber);
        setRolling(false);
        setSettled(true);
      }, 900);

      return () => {
        clearInterval(rollInterval);
        clearTimeout(stopDelay);
      };
    }, delay);

    return () => clearTimeout(startDelay);
  }, [finalNumber, delay]);

  const colors = COLOR_MAP[colorType] || COLOR_MAP.neutral;
  const bgColor = rolling ? colors.rolling : settled ? colors.bg : COLOR_MAP.empty.bg;
  const boxShadow = settled && colorType !== 'empty'
    ? `0 0 20px ${colors.glow}, 0 4px 12px rgba(0,0,0,0.4)`
    : '0 2px 8px rgba(0,0,0,0.4)';

  return (
    <div style={{
      width: '72px',
      height: '72px',
      borderRadius: '50%',
      backgroundColor: bgColor,
      color: 'white',
      fontWeight: '700',
      fontSize: rolling ? '18px' : '22px',
      fontFamily: "'DM Sans', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.25s ease, box-shadow 0.3s ease, font-size 0.1s ease',
      boxShadow,
      transform: rolling ? 'scale(1.08)' : settled ? 'scale(1)' : 'scale(0.92)',
      border: settled && colorType !== 'empty'
        ? `2px solid rgba(255,255,255,0.2)`
        : '2px solid rgba(255,255,255,0.05)',
      position: 'relative',
      userSelect: 'none',
      cursor: 'default',
    }}>
      {finalNumber === null ? '' : displayNumber}

      {/* Gold star badge for top-6 all-time */}
      {settled && isCommon && (
        <span style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          fontSize: '13px',
          background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
          color: '#1a1a1a',
          borderRadius: '50%',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(245,158,11,0.5)',
          lineHeight: 1,
        }}>★</span>
      )}
    </div>
  );
}

export default Dice;
