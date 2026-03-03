import React, { useState, useEffect } from 'react';
import Dice from './Dice';

function App() {
  const [numbers, setNumbers] = useState([]);
  const [hot, setHot] = useState([]);
  const [cold, setCold] = useState([]);
  const [topAll, setTopAll] = useState([]);
  const [topRecent, setTopRecent] = useState([]);
  const [topCommon, setTopCommon] = useState([]);
  const [generating, setGenerating] = useState(false);

  const generateNumbers = async () => {
    setGenerating(true);
    setNumbers([]); // clear previous so balls reset
    try {
      const response = await fetch('http://localhost:5000/api/generate');
      const data = await response.json();
      // Small pause so balls visibly reset to '?' before rolling
      setTimeout(() => {
        setNumbers(data.numbers);
        setHot(data.hot);
        setCold(data.cold);
        setTopCommon(data.topCommon);
        setGenerating(false);
      }, 150);
    } catch (err) {
      alert('Could not connect to server. Make sure the server is running on port 5000.');
      setGenerating(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      const data = await response.json();
      setHot(data.hot);
      setCold(data.cold);
    } catch (err) {
      console.error('Could not load stats:', err);
    }
  };

  const fetchFrequency = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/frequency');
      const data = await response.json();
      setTopAll(data.topAll);
      setTopRecent(data.topRecent);
    } catch (err) {
      console.error('Could not load frequency data:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchFrequency();
  }, []);

  const getBallColor = (num) => {
    if (hot.includes(num)) return '#e74c3c';  // red for hot
    if (cold.includes(num)) return '#3498db'; // blue for cold
    return '#2ecc71';                          // green for random
  };

  // Each ball starts rolling 400ms after the previous one
  const getDelay = (index) => index * 400;

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎲 Michigan Lotto 47 Generator</h1>

      <button
        onClick={generateNumbers}
        disabled={generating}
        style={{ fontSize: '16px', padding: '10px 24px', cursor: generating ? 'not-allowed' : 'pointer' }}
      >
        {generating ? 'Drawing...' : 'Generate Numbers'}
      </button>

      <div style={{ marginTop: '40px' }}>
        <strong style={{ fontSize: '20px' }}>Your Draw:</strong>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', minHeight: '70px' }}>
          {numbers.length > 0
            ? numbers.map((num, index) => (
                <Dice
                  key={`${num}-${index}`}
                  finalNumber={num}
                  delay={getDelay(index)}
                  color={getBallColor(num)}
                  isCommon={topCommon.includes(num)}
                />
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <Dice
                  key={`empty-${index}`}
                  finalNumber={null}
                  delay={0}
                  color="#888"
                  isCommon={false}
                />
              ))
          }
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: '24px', fontSize: '14px', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <span><span style={{ color: '#e74c3c' }}>🔴</span> Hot (4+ recent appearances)</span>
        <span><span style={{ color: '#3498db' }}>🔵</span> Cold (0 recent appearances)</span>
        <span><span style={{ color: '#2ecc71' }}>🟢</span> Random pick</span>
        <span>⭐ Top 6 most common overall</span>
      </div>

      {/* Stats */}
      <div style={{ marginTop: '40px' }}>
        <h2>🔥 Hot Numbers (4+ appearances in last 16 draws)</h2>
        <p>{hot.join(', ') || 'None'}</p>

        <h2>❄️ Cold Numbers (0 appearances in last 16 draws)</h2>
        <p>{cold.join(', ') || 'None'}</p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>📊 Most Common (Last 16 Draws)</h2>
        <p>{topRecent.join(', ') || 'None'}</p>

        <h2>📊 Most Common (All Time)</h2>
        <p>{topAll.join(', ') || 'None'}</p>
      </div>
    </div>
  );
}

export default App;
