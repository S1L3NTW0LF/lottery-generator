import React, { useState, useEffect } from 'react';

function Dice({ finalNumber, delay, color, isCommon }) {
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

    // Small pause before this ball starts rolling (stagger effect)
    const startDelay = setTimeout(() => {
      setRolling(true);
      setSettled(false);

      const rollInterval = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 47) + 1);
      }, 80);

      // After rolling duration, snap to final number
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

  return (
    <div
      style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: settled ? color : '#888',
        color: 'white',
        fontWeight: 'bold',
        fontSize: rolling ? '16px' : '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.3s ease, font-size 0.1s ease',
        boxShadow: settled ? `0 4px 12px ${color}88` : '0 2px 6px rgba(0,0,0,0.3)',
        transform: rolling ? 'scale(1.05)' : settled ? 'scale(1)' : 'scale(0.95)',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      {displayNumber}
      {settled && isCommon && (
        <span style={{
          position: 'absolute',
          top: '-6px',
          right: '-4px',
          fontSize: '12px',
          background: '#f1c40f',
          color: '#333',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        }}>★</span>
      )}
    </div>
  );
}

export default Dice;
