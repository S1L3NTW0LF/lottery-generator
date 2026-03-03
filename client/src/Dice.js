import React, { useState, useEffect } from 'react';

function Dice({ finalNumber, delay }) {
  const [displayNumber, setDisplayNumber] = useState('?');
  const [rolling, setRolling] = useState(true);

  useEffect(() => {
    let rollInterval;
    let timeout;

    if (rolling) {
      rollInterval = setInterval(() => {
        setDisplayNumber(Math.floor(Math.random() * 6) + 1); // Simulate dice roll
      }, 100);

      timeout = setTimeout(() => {
        clearInterval(rollInterval);
        setDisplayNumber(finalNumber);
        setRolling(false);
      }, delay);
    }

    return () => {
      clearInterval(rollInterval);
      clearTimeout(timeout);
    };
  }, [rolling, finalNumber, delay]);

  return (
    <div style={{ fontSize: '2rem', margin: '10px', transition: 'all 0.3s ease' }}>
      {displayNumber}
    </div>
  );
}

export default Dice;